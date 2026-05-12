import ContentDetailPage from '@/components/ContentDetailPage';

export default async function MusicItemPage({ params }) {
  const { id } = await params;
  return <ContentDetailPage id={id} pageSlug="music" />;
}
