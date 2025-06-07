import { Prisma } from '@prisma/client'

// Use Prisma-generated types for type safety
export type CompanionWithTags = Prisma.CompanionGetPayload<{
  include: {
    tags: {
      include: {
        tag: {
          select: {
            name: true
          }
        }
      }
    }
    _count: {
      select: {
        socialReactions: {
          where: {
            type: 'LIKE'
          }
        }
        chats: true
      }
    }
  }
}>

export type CategorizedCompanions = {
  [K in typeof CATEGORIES[number]]: CompanionWithTags[]
}

export const CATEGORIES = ['trending', 'anime', 'celebrities'] as const

// Collections-specific types
export type CollectionCompanion = Prisma.CompanionGetPayload<{
  include: {
    tags: {
      include: {
        tag: {
          select: {
            name: true
          }
        }
      }
    }
    _count: {
      select: {
        socialReactions: {
          where: {
            type: 'LIKE'
          }
        }
        chats: true
      }
    }
  }
}>

export type ChatHistory = Prisma.ChatGetPayload<{
  include: {
    companion: {
      select: {
        id: true
        name: true
        imageUrl: true
      }
    }
    messages: {
      select: {
        content: true
        createdAt: true
      }
      orderBy: {
        createdAt: 'desc'
      }
      take: 1
    }
  }
}>

export type StarredMessage = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        displayName: true
        imageUrl: true
      }
    }
    chat: {
      include: {
        companion: {
          select: {
            id: true
            name: true
            imageUrl: true
          }
        }
      }
    }
  }
}>

export interface CollectionsData {
  createdCompanions: CollectionCompanion[]
  likedCompanions: CollectionCompanion[]
  recentCompanions: CollectionCompanion[]
  chatHistory: ChatHistory[]
  starredMessages: StarredMessage[]
} 