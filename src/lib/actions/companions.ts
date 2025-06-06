'use server'

import { prisma } from '@/lib/db'
import type { CategorizedCompanions } from '@/types/companions'

export async function getCategorizedCompanions(): Promise<CategorizedCompanions> {
  try {
    // Fetch all public companions with their tags and counts
    const companions = await prisma.companion.findMany({
      where: {
        isPublic: true
      },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            socialReactions: {
              where: {
                type: 'LIKE'
              }
            },
            chats: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Shuffle the companions array to randomize assignment
    const shuffled = [...companions].sort(() => Math.random() - 0.5)
    
    // Distribute companions across categories
    const companionsPerCategory = Math.ceil(shuffled.length / 3)
    
    const categorized: CategorizedCompanions = {
      trending: shuffled.slice(0, companionsPerCategory),
      anime: shuffled.slice(companionsPerCategory, companionsPerCategory * 2),
      celebrities: shuffled.slice(companionsPerCategory * 2)
    }

    return categorized
  } catch (error) {
    console.error('Error fetching categorized companions:', error)
    // Pass the actual error details to frontend for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    throw new Error(JSON.stringify({
      message: 'Failed to fetch companions. Please try again later.',
      debug: {
        originalError: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }
    }))
  }
} 