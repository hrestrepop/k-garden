import { NextRequest, NextResponse } from "next/server";
import { listTopics, createTopic } from "@/lib/knowledge-store";

export async function GET() {
  try {
    return NextResponse.json(await listTopics());
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const topic = await createTopic(await req.json());
    return NextResponse.json(topic, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
