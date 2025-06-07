import { getProfile, getUsageStats } from '@/lib/actions/profile'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import Profile from '@/components/me/Profile'

export default async function MePage() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['profile', 'data'],
      queryFn: getProfile,
    }),
    queryClient.prefetchQuery({
      queryKey: ['profile', 'usage'],
      queryFn: getUsageStats,
    })
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Profile />
    </HydrationBoundary>
  )
}
