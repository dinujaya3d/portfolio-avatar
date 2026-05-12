import ContentDetailPage from '@/components/ContentDetailPage';

export default async function ThoughtItemPage({ params }) {
  const { id } = await params;
  return <ContentDetailPage id={id} pageSlug="thoughts" />;
}
