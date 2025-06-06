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
  trending: CompanionWithTags[]
  anime: CompanionWithTags[]
  celebrities: CompanionWithTags[]
}

export const CATEGORIES = ['trending', 'anime', 'celebrities'] as const 