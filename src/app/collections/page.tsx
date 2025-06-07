import { getCollectionsData } from "@/lib/actions/collections";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import Collections from "@/components/collections/Collections";

export default async function CollectionsPage() {
  const queryClient = new QueryClient()

  // Prefetch the collections data
  await queryClient.prefetchQuery({
    queryKey: ['collections-data'],
    queryFn: getCollectionsData,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Collections />
    </HydrationBoundary>
  );
}
