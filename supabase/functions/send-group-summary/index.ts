// Supabase Edge Function: send-group-summary
// Sends daily group summary notifications showing how many members checked in.
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
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Find users with group summary enabled
    const { data: settings, error: settingsError } = await supabase
      .from("notification_settings")
      .select("user_id, group_id, group_summary_time")
      .eq("group_summary_enabled", true);

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
    const eligibleSettings = settings.filter((s) => {
      const [h, m] = s.group_summary_time.split(":").map(Number);
      const settingMinutes = h * 60 + m;
      return Math.abs(nowMinutes - settingMinutes) <= 5;
    });

    if (eligibleSettings.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get unique group IDs
    const groupIds = [...new Set(eligibleSettings.map((s) => s.group_id))];

    // For each group, get today's checkin count and total members
    const messages: PushMessage[] = [];

    for (const groupId of groupIds) {
      const [checkinsResult, membersResult] = await Promise.all([
        supabase
          .from("checkins")
          .select("user_id")
          .eq("group_id", groupId)
          .eq("date", today),
        supabase
          .from("group_members")
          .select("user_id")
          .eq("group_id", groupId),
      ]);

      const checkinCount = checkinsResult.data?.length ?? 0;
      const memberCount = membersResult.data?.length ?? 0;

      // Get eligible users for this group
      const usersInGroup = eligibleSettings
        .filter((s) => s.group_id === groupId)
        .map((s) => s.user_id);

      // Get push tokens
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, expo_push_token")
        .in("id", usersInGroup)
        .not("expo_push_token", "is", null);

      if (profiles) {
        for (const profile of profiles) {
          if (profile.expo_push_token) {
            messages.push({
              to: profile.expo_push_token,
              title: "Daily Group Summary",
              body: `${checkinCount}/${memberCount} family members completed their session today!`,
              data: { screen: "group" },
              sound: "default",
            });
          }
        }
      }
    }

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
