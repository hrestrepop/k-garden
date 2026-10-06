import { NextRequest, NextResponse } from "next/server";
import { getNote, saveNote, deleteNote } from "@/lib/knowledge-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; noteId: string }> },
) {
  const { slug, noteId } = await params;
  const note = await getNote(slug, noteId);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; noteId: string }> },
) {
  const { slug, noteId } = await params;
  const note = await saveNote(slug, noteId, await req.json());
  return NextResponse.json(note);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; noteId: string }> },
) {
  const { slug, noteId } = await params;
  const ok = await deleteNote(slug, noteId);
  return ok
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: "Failed" }, { status: 500 });
}
