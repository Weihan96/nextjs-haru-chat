'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

// Types for comprehensive chat data
export interface ComprehensiveChatData {
  id: string
  userId: string
  companion: {
    id: string
    name: string
    imageUrl: string | null
    description: string | null
    tags: Array<{ tag: { name: string } }>
  }
  recentMessages: Array<{
    id: string
    content: string
    createdAt: Date
    senderId: string
    attachments: Array<{ imageUrl: string }>
  }>
  lastMessageAt: Date
  messageCount: number
}


// Helper function to get database user ID from Clerk
async function getUserIdFromAuth(): Promise<string> {
  // Get the full user object to access external_id
  const user = await currentUser()
  
  if (!user) {
    throw new Error(JSON.stringify({
      message: 'Unauthorized',
      debug: { 
        error: 'User unauthorized',
        timestamp: new Date().toISOString() 
      }
    }))
  }

  // Use external_id (our database user ID) if available
  if (user.externalId) {
    return user.externalId
  }

  console.log("Fallback: If external_id is not set, look up the user in our database using Clerk ID")
  // Fallback: If external_id is not set, look up the user in our database using Clerk ID
  // This handles cases where users were created before the webhook was working properly
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { id: true }
  })

  if (!dbUser) {
    throw new Error(JSON.stringify({
      message: 'User not found in database',
      debug: { 
        error: 'No database record found for this user. User may need to be synced.',
        clerkUserId: user.id,
        timestamp: new Date().toISOString() 
      }
    }))
  }

  return dbUser.id
}

// Comprehensive chat data fetching - 10 chats with companion info and 6 recent messages
export async function getComprehensiveChatData(page = 0): Promise<{
  chats: ComprehensiveChatData[]
  hasNextPage: boolean
}> {
  try {
    // Get database user ID from Clerk
    const userId = await getUserIdFromAuth()

    const CHATS_PER_PAGE = 10

    const chats = await prisma.chat.findMany({
      where: {
        userId: userId,
        isDeleted: false
      },
      include: {
        companion: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true,
            tags: {
              include: {
                tag: {
                  select: { name: true }
                }
              }
            }
          }
        },
        messages: {
          where: {
            isDeleted: false,
            content: { not: null }
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
          select: {
            id: true,
            content: true,
            createdAt: true,
            senderId: true,
            attachments: {
              select: { imageUrl: true },
              take: 1
            }
          }
        },
        _count: {
          select: {
            messages: {
              where: { isDeleted: false }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      skip: page * CHATS_PER_PAGE,
      take: CHATS_PER_PAGE + 1
    })

    const hasNextPage = chats.length > CHATS_PER_PAGE
    const chatData = chats.slice(0, CHATS_PER_PAGE)

    const transformedChats: ComprehensiveChatData[] = chatData.map(chat => ({
      id: chat.id,
      userId: userId,
      companion: {
        id: chat.companion.id,
        name: chat.companion.name,
        imageUrl: chat.companion.imageUrl,
        description: chat.companion.description,
        tags: chat.companion.tags
      },
      recentMessages: chat.messages.map(msg => ({
        id: msg.id,
        content: msg.content || '',
        createdAt: msg.createdAt,
        senderId: msg.senderId,
        attachments: msg.attachments
      })),
      lastMessageAt: chat.updatedAt,
      messageCount: chat._count.messages
    }))

    return {
      chats: transformedChats,
      hasNextPage
    }

  } catch (error) {
    console.error('🔴 getComprehensiveChatData error:', error)
    throw new Error(JSON.stringify({
      message: 'Failed to load chat data',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }))
  }
}

// Get paginated chat messages (for infinite scroll within chat window)
export async function getChatMessagesPage(chatId: string, page = 0): Promise<{
  messages: Array<{
    id: string
    content: string
    timestamp: string
    isUser: boolean
    image?: string
  }>
  hasNextPage: boolean
}> {
  try {
    // Get database user ID from Clerk
    const userId = await getUserIdFromAuth()

    // Verify user owns this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId
      }
    })

    if (!chat) {
      throw new Error(JSON.stringify({
        message: 'Chat not found or access denied',
        debug: { chatId, userId: userId, timestamp: new Date().toISOString() }
      }))
    }

    const MESSAGES_PER_PAGE = 20

    const messages = await prisma.message.findMany({
      where: {
        chatId,
        isDeleted: false,
        content: { not: null } // Ensure content is not null
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        senderId: true,
        attachments: {
          select: { imageUrl: true },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: page * MESSAGES_PER_PAGE,
      take: MESSAGES_PER_PAGE + 1
    })

    const hasNextPage = messages.length > MESSAGES_PER_PAGE
    const messageData = messages.slice(0, MESSAGES_PER_PAGE)

    const transformedMessages = messageData.map((message) => ({
      id: message.id,
      content: message.content || '', // Handle null content
      timestamp: message.createdAt.toISOString(),
      isUser: message.senderId === userId, // Now correctly compares database user IDs
      image: message.attachments[0]?.imageUrl
    }))

    return {
      messages: transformedMessages,
      hasNextPage
    }

  } catch (error) {
    console.error('🔴 getChatMessagesPage error:', error)
    throw new Error(JSON.stringify({
      message: 'Failed to load chat messages',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        chatId,
        timestamp: new Date().toISOString()
      }
    }))
  }
}

// Get individual companion data (for info panels that need fresh data)
export async function getChatCompanion(chatId: string) {
  try {
    // Get database user ID from Clerk
    const userId = await getUserIdFromAuth()

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId
      },
      include: {
        companion: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            description: true,
            tags: {
              include: {
                tag: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    })

    if (!chat) {
      throw new Error(JSON.stringify({
        message: 'Chat not found',
        debug: { chatId, userId: userId, timestamp: new Date().toISOString() }
      }))
    }

    return {
      id: chat.companion.id,
      name: chat.companion.name,
      avatar: chat.companion.imageUrl ?? '/placeholder-avatar.png',
      description: chat.companion.description ?? '',
      tags: chat.companion.tags.map((ct) => ct.tag.name)
    }

  } catch (error) {
    console.error('🔴 getChatCompanion error:', error)
    throw new Error(JSON.stringify({
      message: 'Failed to load companion data',
      debug: {
        originalError: error instanceof Error ? error.message : 'Unknown error',
        chatId,
        timestamp: new Date().toISOString()
      }
    }))
  }
} 