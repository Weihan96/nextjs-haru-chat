'use server'

import { prisma } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'
import type { CollectionsData } from '@/types/companions'

export async function getCollectionsData(): Promise<CollectionsData> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Find the user in our database using Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    })

    if (!user) {
      throw new Error('User not found in database')
    }

    // Fetch all data in parallel for better performance
    const [
      createdCompanions,
      likedCompanions,
      recentCompanions,
      chatHistory,
      starredMessages
    ] = await Promise.all([
      // Created companions by the user
      prisma.companion.findMany({
        where: {
          creatorId: user.id
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
      }),

      // Liked companions by the user
      prisma.companion.findMany({
        where: {
          socialReactions: {
            some: {
              userId: user.id,
              type: 'LIKE'
            }
          }
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
          updatedAt: 'desc'
        }
      }),

      // Recent companions (from recent chats)
      prisma.companion.findMany({
        where: {
          chats: {
            some: {
              userId: user.id
            }
          }
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
          updatedAt: 'desc'
        },
        take: 10 // Limit to recent 10
      }),

      // Chat history
      prisma.chat.findMany({
        where: {
          userId: user.id,
          isDeleted: false
        },
        include: {
          companion: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          },
          messages: {
            select: {
              content: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        },
        orderBy: {
          updatedAt: 'desc'
        },
        take: 20 // Limit to recent 20 chats
      }),

      // Starred messages
      prisma.message.findMany({
        where: {
          socialReactions: {
            some: {
              userId: user.id,
              type: 'BOOKMARK'
            }
          }
        },
        include: {
          sender: {
            select: {
              displayName: true,
              imageUrl: true
            }
          },
          chat: {
            include: {
              companion: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50 // Limit to recent 50 starred messages
      })
    ])

    return {
      createdCompanions,
      likedCompanions,
      recentCompanions,
      chatHistory,
      starredMessages
    }

  } catch (error) {
    console.error('Error fetching collections data:', error)
    // Pass the actual error details to frontend for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    throw new Error(JSON.stringify({
      message: 'Failed to fetch collections data. Please try again later.',
      debug: {
        originalError: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      }
    }))
  }
} 