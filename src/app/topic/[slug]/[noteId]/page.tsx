import NotePage from "@/components/editor/NotePage";

export default async function NoteRoute({
  params,
}: {
  params: Promise<{ slug: string; noteId: string }>;
}) {
  const { slug, noteId } = await params;
  return <NotePage slug={slug} noteId={noteId} />;
}
