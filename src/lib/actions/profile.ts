'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { revalidateTag } from 'next/cache'
import { profileFormSchema } from '@/lib/schemas/profile'

export interface ProfileData {
  id: string
  clerkId: string
  email: string
  username: string | null
  displayName: string | null
  bio: string | null
  imageUrl: string | null
  credits: number
  isOnline: boolean
  lastSeen: Date | null
  createdAt: Date
  updatedAt: Date
  // Usage stats
  totalChats: number
  totalMessages: number
  companionsCreated: number
}

export interface UpdateProfileData {
  username?: string
  displayName?: string
  bio?: string
}

/**
 * Fetch current user's profile data
 */
export async function getProfile(): Promise<ProfileData> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Find the user in our database using Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: {
            chats: true,
            sentMessages: true,
            createdCompanions: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      imageUrl: user.imageUrl,
      credits: user.credits,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      totalChats: user._count.chats,
      totalMessages: user._count.sentMessages,
      companionsCreated: user._count.createdCompanions
    }

  } catch (error) {
    console.error('🔴 Error fetching user profile:', error)
    throw new Error(JSON.stringify({
      message: 'Failed to fetch user profile',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }))
  }
}

/**
 * Update user profile data with Zod validation
 */
export async function updateProfile(data: UpdateProfileData): Promise<ProfileData> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Validate input data with Zod schema
    const validationResult = profileFormSchema.safeParse(data)
    
    if (!validationResult.success) {
      throw new Error(JSON.stringify({
        message: 'Invalid input data',
        debug: {
          validationErrors: validationResult.error.flatten().fieldErrors,
          providedData: data,
          timestamp: new Date().toISOString()
        }
      }))
    }

    const validatedData = validationResult.data

    // Convert empty strings to null for database storage
    const updateData = {
      username: validatedData.username || null,
      displayName: validatedData.displayName || null,
      bio: validatedData.bio || null,
      updatedAt: new Date()
    }

    // Check if username is unique (if provided and changed)
    if (updateData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: updateData.username,
          clerkId: { not: userId }
        }
      })

      if (existingUser) {
        throw new Error(JSON.stringify({
          message: 'Username is already taken',
          debug: {
            username: updateData.username,
            timestamp: new Date().toISOString()
          }
        }))
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: updateData,
      include: {
        _count: {
          select: {
            chats: true,
            sentMessages: true,
            createdCompanions: true
          }
        }
      }
    })

    // Revalidate the user profile cache
    revalidateTag('profile')

    return {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      username: updatedUser.username,
      displayName: updatedUser.displayName,
      bio: updatedUser.bio,
      imageUrl: updatedUser.imageUrl,
      credits: updatedUser.credits,
      isOnline: updatedUser.isOnline,
      lastSeen: updatedUser.lastSeen,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
      totalChats: updatedUser._count.chats,
      totalMessages: updatedUser._count.sentMessages,
      companionsCreated: updatedUser._count.createdCompanions
    }

  } catch (error) {
    console.error('🔴 Error updating user profile:', error)
    
    // Re-throw if it's already a formatted error
    if (error instanceof Error && error.message.startsWith('{')) {
      throw error
    }
    
    throw new Error(JSON.stringify({
      message: 'Failed to update user profile',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        data,
        timestamp: new Date().toISOString()
      }
    }))
  }
}

/**
 * Get user usage statistics for subscription UI
 */
export async function getUsageStats(): Promise<{
  totalChats: number
  totalMessages: number
  companionsCreated: number
  currentPlan: 'free' | 'premium' | 'pro'
  usagePercentage: number
  remainingChats: number
}> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        _count: {
          select: {
            chats: true,
            sentMessages: true,
            createdCompanions: true
          }
        }
      }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    // For now, we'll assume everyone is on free plan
    // In a real app, you'd have a subscription table
    const currentPlan = 'free'
    const maxChatsPerDay = currentPlan === 'free' ? 50 : currentPlan === 'premium' ? 1000 : 10000
    
    // Get today's chat count (simplified - you might want to track daily usage separately)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const todayChats = await prisma.chat.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: todayStart
        }
      }
    })

    const usagePercentage = Math.min((todayChats / maxChatsPerDay) * 100, 100)
    const remainingChats = Math.max(maxChatsPerDay - todayChats, 0)

    return {
      totalChats: user._count.chats,
      totalMessages: user._count.sentMessages,
      companionsCreated: user._count.createdCompanions,
      currentPlan,
      usagePercentage,
      remainingChats
    }

  } catch (error) {
    console.error('🔴 Error fetching usage stats:', error)
    throw new Error(JSON.stringify({
      message: 'Failed to fetch usage statistics',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }))
  }
} 