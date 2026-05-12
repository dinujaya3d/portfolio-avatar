import ContentDetailPage from '@/components/ContentDetailPage';

export default async function BookItemPage({ params }) {
  const { id } = await params;
  return <ContentDetailPage id={id} pageSlug="books" />;
}
