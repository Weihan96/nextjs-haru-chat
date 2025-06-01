import { prisma } from './db'
import { User, Chat, Message } from '@prisma/client'

// User operations
export async function createUser(data: {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}) {
  try {
    return await prisma.user.create({
      data,
    })
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await prisma.user.findUnique({
      where: { clerkId },
      include: {
        chats: {
          orderBy: { updatedAt: 'desc' },
          take: 10, // Limit to recent chats
        },
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

// Chat operations
export async function createChat(data: {
  title: string
  userId: string
}) {
  try {
    return await prisma.chat.create({
      data,
      include: {
        messages: true,
      },
    })
  } catch (error) {
    console.error('Error creating chat:', error)
    throw error
  }
}

export async function getChatById(chatId: string, userId: string) {
  try {
    return await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId, // Ensure user owns the chat
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching chat:', error)
    throw error
  }
}

export async function getUserChats(userId: string) {
  try {
    return await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  } catch (error) {
    console.error('Error fetching user chats:', error)
    throw error
  }
}

// Message operations
export async function createMessage(data: {
  content: string
  role: 'user' | 'assistant'
  chatId: string
  userId: string
}) {
  try {
    const message = await prisma.message.create({
      data,
    })

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: data.chatId },
      data: { updatedAt: new Date() },
    })

    return message
  } catch (error) {
    console.error('Error creating message:', error)
    throw error
  }
}

export async function getChatMessages(chatId: string, userId: string) {
  try {
    // First verify the user owns the chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    })

    if (!chat) {
      throw new Error('Chat not found or access denied')
    }

    return await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    throw error
  }
}

// Cleanup operations
export async function deleteChat(chatId: string, userId: string) {
  try {
    // Verify ownership before deletion
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId,
      },
    })

    if (!chat) {
      throw new Error('Chat not found or access denied')
    }

    // Delete chat (messages will be deleted due to cascade)
    return await prisma.chat.delete({
      where: { id: chatId },
    })
  } catch (error) {
    console.error('Error deleting chat:', error)
    throw error
  }
} 