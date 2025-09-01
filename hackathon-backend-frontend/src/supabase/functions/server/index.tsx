import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// ----------------------------
// Supabase Admin Client
// ----------------------------
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ----------------------------
// Middleware
// ----------------------------
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// ----------------------------
// Health Check
// ----------------------------
app.get("/make-server-327fee6a/health", (c) => {
  return c.json({ status: "ok" });
});

// ----------------------------
// Signup
// ----------------------------
app.post("/make-server-327fee6a/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (error) return c.json({ error: error.message }, 400);

    const userId = data.user.id;
    const initialUserData = {
      id: userId,
      name,
      email,
      level: 1,
      xp: 0,
      joinDate: new Date().toISOString(),
      totalAnalyses: 0,
      bestStreak: 0,
      currentStreak: 0,
      sustainabilityRating: 0,
    };

    await kv.set(`user:${userId}`, initialUserData);
    await kv.set(`user:${userId}:history`, []);

    return c.json({ user: data.user, userData: initialUserData });
  } catch (err) {
    console.error(`Signup error: ${err}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// ----------------------------
// Get User Data
// ----------------------------
app.get("/make-server-327fee6a/user/:userId", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    const userId = c.req.param("userId");
    if (!user?.id || user.id !== userId) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${userId}`);
    const history = (await kv.get(`user:${userId}:history`)) || [];

    if (!userData) return c.json({ error: "User not found" }, 404);

    return c.json({ userData, history });
  } catch (err) {
    console.error(`Get user error: ${err}`);
    return c.json({ error: "Internal server error while getting user data" }, 500);
  }
});

// ----------------------------
// Update User Profile
// ----------------------------
app.put("/make-server-327fee6a/user/:userId", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    const userId = c.req.param("userId");
    if (!user?.id || user.id !== userId) return c.json({ error: "Unauthorized" }, 401);

    const updateData = await c.req.json();
    const existing = await kv.get(`user:${userId}`);
    if (!existing) return c.json({ error: "User not found" }, 404);

    const updated = { ...existing, ...updateData };
    await kv.set(`user:${userId}`, updated);

    return c.json({ userData: updated });
  } catch (err) {
    console.error(`Update user error: ${err}`);
    return c.json({ error: "Internal server error while updating user data" }, 500);
  }
});

// ----------------------------
// Add Analysis
// ----------------------------
// ----------------------------
// Add Analysis
// ----------------------------
app.post("/make-server-327fee6a/user/:userId/analysis", async (c) => {
  try {
    const token = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user } } = await supabase.auth.getUser(token);

    const userId = c.req.param("userId");
    if (!user?.id || user.id !== userId) return c.json({ error: "Unauthorized" }, 401);

    const analysisData = await c.req.json();
    analysisData.analyzedAt = new Date().toISOString();

    const history = (await kv.get(`user:${userId}:history`)) || [];
    const userData = await kv.get(`user:${userId}`);
    if (!userData) return c.json({ error: "User not found" }, 404);

    const newHistory = [analysisData, ...history.slice(0, 49)];
    await kv.set(`user:${userId}:history`, newHistory);

    // ----------------------------
    // ✅ Calculate streak
    // ----------------------------
    let currentStreak = 1;
    let bestStreak = userData.bestStreak || 0;

    const sorted = [...newHistory].sort(
      (a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
    );

    let prevDate = new Date(sorted[0].analyzedAt);

    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].analyzedAt);
      const diffDays = Math.floor(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
        prevDate = currentDate;
      } else if (diffDays > 1) {
        break;
      }
    }

    // Reset streak if last activity not yesterday/today
    const today = new Date();
    const lastActivity = new Date(sorted[0].analyzedAt);
    const daysSinceLast = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLast > 1) currentStreak = 0;

    if (currentStreak > bestStreak) bestStreak = currentStreak;

    // ----------------------------
    // XP + Level
    // ----------------------------
    const newXP = userData.xp + (analysisData.xpGained || 0);
    const newLevel = Math.floor(newXP / 1000) + 1;

    const updatedUserData = {
      ...userData,
      xp: Math.max(0, newXP),
      level: Math.max(1, newLevel),
      totalAnalyses: userData.totalAnalyses + 1,
      currentStreak,
      bestStreak,
    };

    await kv.set(`user:${userId}`, updatedUserData);

    return c.json({ userData: updatedUserData, history: newHistory });
  } catch (err) {
    console.error(`Add analysis error: ${err}`);
    return c.json({ error: "Internal server error while adding analysis" }, 500);
  }
});


// ----------------------------
// Leaderboard
// ----------------------------
app.get("/make-server-327fee6a/leaderboard", async (c) => {
  try {
    const entries = await kv.getByPrefix("user:");
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const leaderboardData = [];

    for (const entry of entries) {
      if (entry.key.includes(":history")) continue;

      const user = entry.value;
      const history = (await kv.get(`user:${user.id}:history`)) || [];

      const weeklyXP = history
        .filter((h: any) => h.analyzedAt && new Date(h.analyzedAt) >= oneWeekAgo)
        .reduce((sum: number, h: any) => sum + (h.xpGained || 0), 0);

      leaderboardData.push({
        id: user.id,
        name: user.name || "Unknown",
        level: user.level ?? 1,
        xp: user.xp ?? 0,
        weeklyXP,
      });
    }

    leaderboardData.sort((a, b) => b.xp - a.xp);
    const ranked = leaderboardData.map((u, i) => ({ ...u, rank: i + 1 }));

    return c.json({ leaderboard: ranked });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return c.json({ error: "Internal server error while getting leaderboard" }, 500);
  }
});

// ----------------------------
// Analyze (proxy to Python)
// ----------------------------
app.post("/make-server-327fee6a/analyze", async (c) => {
  try {
    const { item } = await c.req.json();
    if (!item) return c.json({ error: "Item is required" }, 400);

    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_name: item }),
    });

    if (!response.ok) {
      console.error("Python backend error:", await response.text());
      return c.json({ error: "Python backend failed" }, 500);
    }

    const analysis = await response.json();
    return c.json(analysis);
  } catch (err) {
    console.error("Analysis error:", err);
    return c.json({ error: "Internal server error during analysis" }, 500);
  }
});

Deno.serve(app.fetch);
