// Supabase Edge Function: send-reminder
// Sends daily reminder push notifications to users who haven't checked in today.
// Designed to be called by pg_cron every 5 minutes.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  sound: "default";
}

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    // Find users with reminders enabled around this time (±5 min window)
    const { data: settings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("user_id, group_id, daily_reminder_time")
      .eq("daily_reminder_enabled", true);

    if (settingsError) {
      return new Response(JSON.stringify({ error: settingsError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!settings || settings.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filter by time window (±5 minutes)
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const eligibleSettings = settings.filter((s) => {
      const [h, m] = s.daily_reminder_time.split(":").map(Number);
      const settingMinutes = h * 60 + m;
      return Math.abs(nowMinutes - settingMinutes) <= 5;
    });

    if (eligibleSettings.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get today's check-ins to exclude users who already checked in
    const userIds = eligibleSettings.map((s) => s.user_id);
    const { data: checkins } = await supabase
      .from("checkins")
      .select("user_id")
      .eq("date", today)
      .in("user_id", userIds);

    const checkedInUsers = new Set((checkins ?? []).map((c) => c.user_id));

    // Get push tokens for eligible users who haven't checked in
    const usersToNotify = userIds.filter((id) => !checkedInUsers.has(id));

    if (usersToNotify.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, expo_push_token")
      .in("id", usersToNotify)
      .not("expo_push_token", "is", null);

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages: PushMessage[] = profiles
      .filter((p) => p.expo_push_token)
      .map((p) => ({
        to: p.expo_push_token!,
        title: "Time to stretch!",
        body: "Don't forget to complete your session today.",
        data: { screen: "checkin" },
        sound: "default" as const,
      }));

    if (messages.length > 0) {
      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages),
      });
    }

    return new Response(JSON.stringify({ sent: messages.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
