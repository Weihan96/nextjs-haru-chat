import { getCategorizedCompanions } from "@/lib/actions/companions";
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import Home from "@/components/home/Home";

// This would be the actual page component in Next.js
export default async function HomePage() {
  const queryClient = new QueryClient()

  // Prefetch the categorized companions data
  await queryClient.prefetchQuery({
    queryKey: ['categorized-companions'],
    queryFn: getCategorizedCompanions,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
