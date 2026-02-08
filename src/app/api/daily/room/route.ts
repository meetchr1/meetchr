import { NextResponse } from "next/server";

/**
 * POST /api/daily/room
 *
 * Creates a temporary Daily.co room for a mentorship video session.
 * The room auto-expires after 1 hour of inactivity.
 *
 * Requires DAILY_API_KEY in environment variables.
 */
export async function POST() {
  const apiKey = process.env.DAILY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Daily API key is not configured." },
      { status: 500 }
    );
  }

  try {
    // Create a temporary room that expires in 1 hour
    const expiry = Math.floor(Date.now() / 1000) + 60 * 60;

    const res = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          exp: expiry,
          enable_chat: true,
          enable_screenshare: true,
          enable_knocking: false,
          start_video_off: false,
          start_audio_off: false,
          max_participants: 2,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Daily API error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to create video room." },
        { status: 502 }
      );
    }

    const room = await res.json();

    return NextResponse.json({
      url: room.url,
      name: room.name,
      expires: room.config?.exp,
    });
  } catch (err) {
    console.error("Daily room creation error:", err);
    return NextResponse.json(
      { error: "Failed to create video room." },
      { status: 500 }
    );
  }
}
