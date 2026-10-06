import TopicView from "@/components/topic/TopicView";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TopicView slug={slug} />;
}
