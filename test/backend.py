"""
EcoLens - Single File Backend (Gemini Version)
Takes an input product name and returns sustainability JSON (via Gemini).
XP gained is computed locally from sustainability scores (NOT by the AI).
Lower scores => higher XP; higher scores => lower/negative XP.
"""

import os
import json
import re
from typing import Dict, Any, Tuple
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# -----------------------------
# Setup
# -----------------------------
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key.strip() == "your_actual_gemini_api_key_here":
    raise ValueError("Please set your GEMINI_API_KEY in a .env file")

genai.configure(api_key=api_key)

# FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Gemini Client Logic
# -----------------------------
class GeminiClient:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-flash")
        self.research_cache: Dict[str, Dict[str, Any]] = {}

    async def validate_and_research_product(
        self, item_name: str
    ) -> Tuple[bool, str, Dict[str, Any]]:
        """Check cache first, otherwise fetch fresh data from Gemini; XP recalculated locally."""
        cache_key = item_name.strip().lower()
        if cache_key in self.research_cache:
            data = self.research_cache[cache_key]
            data["xpGained"] = self._calculate_xp(data)
            return True, "Product validated (cached)", data

        try:
            data = await self._get_comprehensive_product_analysis(item_name)
            data["xpGained"] = self._calculate_xp(data)
            self.research_cache[cache_key] = data
            return True, "Product validated (AI)", data
        except Exception as e:
            return False, f"AI analysis failed: {e}", {"error": str(e)}

    async def _get_comprehensive_product_analysis(self, product_name: str) -> Dict[str, Any]:
        """Call Gemini to analyze a product and return structured sustainability JSON."""
        prompt = f"""
        You are an expert environmental scientist. Analyze '{product_name}' and provide sustainability data.

        CRITICAL RULE:
        - Lower score = more eco-friendly.
        - Higher score = more harmful.
        - 1/10 = very eco-friendly, 10/10 = very harmful.

        OUTPUT: JSON ONLY, EXACT schema:
        {{
            "item": "normalized product name",
            "sustainabilityScore": <1-10>,
            "carbonFootprint": <number>,
            "waterUsage": <number>,
            "landfillTime": <number>,
            "recyclability": <percent>,
            "stages": {{
                "rawMaterials": {{"score": <1-10>, "impact": "Low/Moderate/High/Severe"}},
                "production": {{"score": <1-10>, "impact": "Low/Moderate/High/Severe"}},
                "transportation": {{"score": <1-10>, "impact": "Low/Moderate/High/Severe"}},
                "usage": {{"score": <1-10>, "impact": "Low/Moderate/High/Severe"}},
                "disposal": {{"score": <1-10>, "impact": "Low/Moderate/High/Severe"}}
            }},
            "description": "One-paragraph lifecycle analysis.",
            "confidence": "High",
            "dataSources": "Credible reports"
        }}
        """

        response = await self.model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                max_output_tokens=800,
                response_mime_type="application/json"
            ),
        )

        raw_content = response.text
        parsed = self._parse_json_response(raw_content)

        # Normalize values
        s = parsed.get("sustainabilityScore", 5)
        try:
            parsed["sustainabilityScore"] = max(1, min(10, int(float(s))))
        except Exception:
            parsed["sustainabilityScore"] = 5

        for stage in parsed.get("stages", {}).values():
            try:
                stage["score"] = max(1, min(10, int(float(stage.get("score", 5)))))
            except Exception:
                stage["score"] = 5

        return parsed

    def _parse_json_response(self, response: str) -> Dict[str, Any]:
        """Strict JSON parsing only (no fallback text)."""
        try:
            match = re.search(r"\{.*\}", response, re.DOTALL)
            if not match:
                return {"error": "No JSON found"}
            return json.loads(match.group())
        except Exception as e:
            return {"error": f"JSON parsing failed: {e}"}

    def _calculate_xp(self, data: Dict[str, Any]) -> int:
        """
        XP scoring rule:
        - Low sustainabilityScore = high XP.
        - High sustainabilityScore = low/negative XP.
        Map: 1 -> +1000, 10 -> -250 (linear interpolation, with shaping).
        """
        try:
            overall = float(data.get("sustainabilityScore", 5))
            stages = data.get("stages", {}) or {}
            stage_scores = [float(s.get("score", overall)) for s in stages.values()]
            stage_avg = sum(stage_scores) / len(stage_scores) if stage_scores else overall

            badness = 0.6 * overall + 0.4 * stage_avg
            badness = max(1.0, min(10.0, badness))

            xp = int(round(1000 - ((badness - 1.0) / 9.0) * 1250))

            if badness <= 2.0:
                xp += 100
            if badness >= 8.5:
                xp -= 150

            if stage_scores:
                if max(stage_scores) >= 9:
                    xp -= 100
                if min(stage_scores) <= 2:
                    xp += 50

            return max(-250, min(1000, xp))
        except Exception:
            return 0

# -----------------------------
# FastAPI Routes
# -----------------------------
client = GeminiClient()

class ProductRequest(BaseModel):
    product_name: str

@app.post("/analyze")
async def analyze(req: ProductRequest):
    success, message, data = await client.validate_and_research_product(req.product_name)
    return data

@app.get("/")
async def root():
    return {"status": "EcoLens backend running", "mode": "gemini"}

# -----------------------------
# Run if standalone
# -----------------------------
if __name__ == "__main__":
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
