import { NextRequest, NextResponse } from "next/server";
import { getTopic, updateTopic, deleteTopic } from "@/lib/knowledge-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(topic);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const topic = await updateTopic(slug, await req.json());
  if (!topic)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(topic);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const ok = await deleteTopic(slug);
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Failed" }, { status: 500 });
}
