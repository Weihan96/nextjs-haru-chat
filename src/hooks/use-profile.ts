import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProfile, updateProfile, getUsageStats } from '@/lib/actions/profile'
import type { ProfileData, UpdateProfileData } from '@/lib/actions/profile'

/**
 * Hook to fetch user profile data
 */
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: ['profile', 'data'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled,
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (error.message.includes('not authenticated')) {
        return false
      }
      return failureCount < 3
    }
  })
}

/**
 * Hook to fetch user usage statistics
 */
export function useUsage(options?: {
  enabled?: boolean
}) {
  const { enabled = true } = options || {}
  return useQuery({
    queryKey: ['profile', 'usage'],
    queryFn: getUsageStats,
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes (more frequent updates for usage)
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('not authenticated')) {
        return false
      }
      return failureCount < 3
    }
  })
}

/**
 * Hook to update user profile with optimistic updates
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onMutate: async (newData: UpdateProfileData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile', 'data'] })

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData<ProfileData>(['profile', 'data'])

      // Optimistically update to the new value
      if (previousProfile) {
        queryClient.setQueryData<ProfileData>(['profile', 'data'], {
          ...previousProfile,
          ...newData,
          updatedAt: new Date()
        })
      }

      // Return a context object with the snapshotted value
      return { previousProfile }
    },
    onError: (error, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile', 'data'], context.previousProfile)
      }

      // Parse error message or use fallback
      let errorMessage = 'An unexpected error occurred'
      let debugInfo = error.message

      try {
        const errorData = JSON.parse(error.message)
        errorMessage = errorData.message || 'Please try again later'
        debugInfo = errorData.debug
      } catch {
        // Use default message for non-JSON errors
      }

      console.error('🔴 Profile update error:', debugInfo)
      toast.error('Failed to update profile', {
        description: errorMessage,
        duration: Infinity,
        action: {
          label: 'Retry',
          onClick: () => {
            // Could trigger a refetch or retry the mutation
            queryClient.invalidateQueries({ queryKey: ['profile', 'data'] })
          }
        }
      })
    },
    onSuccess: (data) => {
      // Show success toast
      toast.success('Profile updated successfully', {
        description: 'Your changes have been saved.',
        duration: 3000
      })

      // Invalidate related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['profile', 'usage'] })
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ['profile', 'data'] })
    }
  })
}

/**
 * Hook to prefetch user profile data
 * Useful for preloading data before navigation
 */
export function usePrefetchProfile() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.prefetchQuery({
      queryKey: ['profile', 'data'],
      queryFn: getProfile,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}

/**
 * Hook to get cached user profile data without triggering a fetch
 * Useful for components that need the data but don't want to cause loading states
 */
export function useCachedProfile() {
  const queryClient = useQueryClient()
  return queryClient.getQueryData<ProfileData>(['profile', 'data'])
}

/**
 * Hook to invalidate all user profile queries
 * Useful after actions that might affect user data (like sync operations)
 */
export function useInvalidateProfile() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] })
  }
} 