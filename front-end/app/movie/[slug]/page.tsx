import MovieDetailPage from '@/app/movie/[slug]/MovieDetailPage';

export default async function Index({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <MovieDetailPage params={resolvedParams} />;
}
