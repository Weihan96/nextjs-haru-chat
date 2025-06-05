"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

// Types for search results
export interface SearchResults {
  companions: Array<{
    id: string;
    name: string;
    description: string | null;
    imageUrl: string | null;
    isPublic: boolean;
    creator: {
      username: string | null;
      displayName: string | null;
    };
    tags: Array<{
      id: string;
      name: string;
    }>;
    _relevance?: number;
  }>;
  users: Array<{
    id: string;
    username: string | null;
    displayName: string | null;
    bio: string | null;
    imageUrl: string | null;
    _relevance?: number;
  }>;
  messages: Array<{
    id: string;
    content: string | null;
    createdAt: Date;
    chat: {
      id: string;
      title: string | null;
      companion: {
        name: string;
        imageUrl: string | null;
      };
    };
    _relevance?: number;
  }>;
  checkpoints: Array<{
    id: string;
    title: string;
    description: string | null;
    usageCount: number;
    isPublic: boolean;
    creator: {
      username: string | null;
      displayName: string | null;
    };
    _relevance?: number;
  }>;
}

// Type definitions for raw query results
interface CompanionSearchResult {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isPublic: boolean;
  creatorUsername: string | null;
  creatorDisplayName: string | null;
  tagNames: string | null; // Comma-separated tag names
  tagIds: string | null;   // Comma-separated tag IDs
}

interface UserSearchResult {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  imageUrl: string | null;
}

interface MessageSearchResult {
  id: string;
  content: string | null;
  createdAt: Date;
  chatId: string;
  chatTitle: string | null;
  companionName: string;
  companionImageUrl: string | null;
}

interface CheckpointSearchResult {
  id: string;
  title: string;
  description: string | null;
  usageCount: number;
  isPublic: boolean;
  creatorUsername: string | null;
  creatorDisplayName: string | null;
}

interface ChatMessageSearchResult {
  id: string;
  content: string | null;
  createdAt: Date;
  senderId: string;
  senderUsername: string | null;
  senderDisplayName: string | null;
}

/**
 * Global search across companions, users, messages, and checkpoints
 */
export async function globalSearch(query: string): Promise<SearchResults> {
  const { userId } = await auth();
  
  if (!userId || !query.trim()) {
    return {
      companions: [],
      users: [],
      messages: [],
      checkpoints: [],
    };
  }

  // Sanitize query for PostgreSQL full-text search
  const sanitizedQuery = query.trim().replace(/[^\w\s]/g, "");
  
  try {
    const [companions, users, messages, checkpoints] = await Promise.all([
      searchCompanions(sanitizedQuery, userId),
      searchUsers(sanitizedQuery, userId),
      searchMessages(sanitizedQuery, userId),
      searchCheckpoints(sanitizedQuery, userId),
    ]);

    return {
      companions,
      users,
      messages,
      checkpoints,
    };
  } catch (error) {
    console.error("Global search error:", error);
    return {
      companions: [],
      users: [],
      messages: [],
      checkpoints: [],
    };
  }
}

/**
 * Search AI companions with full-text search including tags
 */
export async function searchCompanions(query: string, currentUserId?: string) {
  const { userId } = await auth();
  const searchUserId = currentUserId || userId;
  
  if (!searchUserId || !query.trim()) return [];

  try {
    // Use PostgreSQL full-text search with to_tsvector and to_tsquery
    // Include tags in the search by joining with CompanionTag and Tag tables
    const companions = await prisma.$queryRaw<CompanionSearchResult[]>`
      SELECT 
        c.id,
        c.name,
        c.description,
        c."imageUrl",
        c."isPublic",
        u.username as "creatorUsername",
        u."displayName" as "creatorDisplayName",
        STRING_AGG(DISTINCT t.name, ',') as "tagNames",
        STRING_AGG(DISTINCT t.id, ',') as "tagIds"
      FROM companions c
      JOIN users u ON c."creatorId" = u.id
      LEFT JOIN companion_tags ct ON c.id = ct."companionId"
      LEFT JOIN tags t ON ct."tagId" = t.id
      WHERE 
        (c."isPublic" = true OR c."creatorId" = ${searchUserId})
        AND (
          c.id IN (
            SELECT DISTINCT comp.id 
            FROM companions comp
            LEFT JOIN companion_tags ct2 ON comp.id = ct2."companionId"
            LEFT JOIN tags t2 ON ct2."tagId" = t2.id
            WHERE 
              to_tsvector('english', comp.name || ' ' || COALESCE(comp.description, '') || ' ' || COALESCE(t2.name, '')) 
              @@ plainto_tsquery('english', ${query})
          )
        )
      GROUP BY c.id, c.name, c.description, c."imageUrl", c."isPublic", c."createdAt", u.username, u."displayName"
      ORDER BY 
        ts_rank(
          to_tsvector('english', c.name || ' ' || COALESCE(c.description, '')), 
          plainto_tsquery('english', ${query})
        ) DESC,
        c."createdAt" DESC
      LIMIT 20
    `;

    return companions.map((companion: CompanionSearchResult) => ({
      id: companion.id,
      name: companion.name,
      description: companion.description,
      imageUrl: companion.imageUrl,
      isPublic: companion.isPublic,
      creator: {
        username: companion.creatorUsername,
        displayName: companion.creatorDisplayName,
      },
      tags: companion.tagNames && companion.tagIds
        ? companion.tagNames.split(',').map((name, index) => ({
            id: companion.tagIds!.split(',')[index],
            name: name.trim()
          }))
        : [],
    }));
  } catch (error) {
    console.error("Companion search error:", error);
    return [];
  }
}

/**
 * Search users with full-text search
 */
export async function searchUsers(query: string, currentUserId?: string) {
  const { userId } = await auth();
  const searchUserId = currentUserId || userId;
  
  if (!searchUserId || !query.trim()) return [];

  try {
    const users = await prisma.$queryRaw<UserSearchResult[]>`
      SELECT 
        id,
        username,
        "displayName",
        bio,
        "imageUrl"
      FROM users
      WHERE 
        id != ${searchUserId}
        AND (
          to_tsvector('english', COALESCE(username, '') || ' ' || COALESCE("displayName", '') || ' ' || COALESCE(bio, '')) 
          @@ plainto_tsquery('english', ${query})
        )
      ORDER BY 
        ts_rank(
          to_tsvector('english', COALESCE(username, '') || ' ' || COALESCE("displayName", '') || ' ' || COALESCE(bio, '')), 
          plainto_tsquery('english', ${query})
        ) DESC
      LIMIT 20
    `;

    return users;
  } catch (error) {
    console.error("User search error:", error);
    return [];
  }
}

/**
 * Search messages within user's chats
 */
export async function searchMessages(query: string, currentUserId?: string) {
  const { userId } = await auth();
  const searchUserId = currentUserId || userId;
  
  if (!searchUserId || !query.trim()) return [];

  try {
    const messages = await prisma.$queryRaw<MessageSearchResult[]>`
      SELECT 
        m.id,
        m.content,
        m."createdAt",
        c.id as "chatId",
        c.title as "chatTitle",
        comp.name as "companionName",
        comp."imageUrl" as "companionImageUrl"
      FROM messages m
      JOIN chats c ON m."chatId" = c.id
      JOIN companions comp ON c."companionId" = comp.id
      WHERE 
        c."userId" = ${searchUserId}
        AND m."isDeleted" = false
        AND m.content IS NOT NULL
        AND to_tsvector('english', m.content) @@ plainto_tsquery('english', ${query})
      ORDER BY 
        ts_rank(to_tsvector('english', m.content), plainto_tsquery('english', ${query})) DESC,
        m."createdAt" DESC
      LIMIT 50
    `;

    return messages.map((message: MessageSearchResult) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      chat: {
        id: message.chatId,
        title: message.chatTitle,
        companion: {
          name: message.companionName,
          imageUrl: message.companionImageUrl,
        },
      },
    }));
  } catch (error) {
    console.error("Message search error:", error);
    return [];
  }
}

/**
 * Search chat checkpoints
 */
export async function searchCheckpoints(query: string, currentUserId?: string) {
  const { userId } = await auth();
  const searchUserId = currentUserId || userId;
  
  if (!searchUserId || !query.trim()) return [];

  try {
    const checkpoints = await prisma.$queryRaw<CheckpointSearchResult[]>`
      SELECT 
        cp.id,
        cp.title,
        cp.description,
        cp."usageCount",
        cp."isPublic",
        u.username as "creatorUsername",
        u."displayName" as "creatorDisplayName"
      FROM chat_checkpoints cp
      JOIN users u ON cp."creatorId" = u.id
      WHERE 
        (cp."isPublic" = true OR cp."creatorId" = ${searchUserId})
        AND (
          to_tsvector('english', cp.title || ' ' || COALESCE(cp.description, '')) 
          @@ plainto_tsquery('english', ${query})
        )
      ORDER BY 
        ts_rank(
          to_tsvector('english', cp.title || ' ' || COALESCE(cp.description, '')), 
          plainto_tsquery('english', ${query})
        ) DESC,
        cp."usageCount" DESC
      LIMIT 20
    `;

    return checkpoints.map((checkpoint: CheckpointSearchResult) => ({
      id: checkpoint.id,
      title: checkpoint.title,
      description: checkpoint.description,
      usageCount: checkpoint.usageCount,
      isPublic: checkpoint.isPublic,
      creator: {
        username: checkpoint.creatorUsername,
        displayName: checkpoint.creatorDisplayName,
      },
    }));
  } catch (error) {
    console.error("Checkpoint search error:", error);
    return [];
  }
}

/**
 * Search within a specific chat
 */
export async function searchWithinChat(chatId: string, query: string) {
  const { userId } = await auth();
  
  if (!userId || !query.trim()) return [];

  try {
    // Verify user owns this chat
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: userId,
      },
    });

    if (!chat) {
      throw new Error("Chat not found or access denied");
    }

    const messages = await prisma.$queryRaw<ChatMessageSearchResult[]>`
      SELECT 
        m.id,
        m.content,
        m."createdAt",
        m."senderId",
        u.username as "senderUsername",
        u."displayName" as "senderDisplayName"
      FROM messages m
      JOIN users u ON m."senderId" = u.id
      WHERE 
        m."chatId" = ${chatId}
        AND m."isDeleted" = false
        AND m.content IS NOT NULL
        AND to_tsvector('english', m.content) @@ plainto_tsquery('english', ${query})
      ORDER BY 
        ts_rank(to_tsvector('english', m.content), plainto_tsquery('english', ${query})) DESC,
        m."createdAt" DESC
      LIMIT 100
    `;

    return messages.map((message: ChatMessageSearchResult) => ({
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      sender: {
        id: message.senderId,
        username: message.senderUsername,
        displayName: message.senderDisplayName,
      },
    }));
  } catch (error) {
    console.error("Chat search error:", error);
    return [];
  }
}

/**
 * Search and filter companions by tag
 */
export async function searchCompanionsByTag(tagId: string, currentUserId?: string) {
  const { userId } = await auth();
  const searchUserId = currentUserId || userId;
  
  if (!searchUserId || !tagId.trim()) return [];

  try {
    const companions = await prisma.companion.findMany({
      where: {
        AND: [
          {
            OR: [
              { isPublic: true },
              { creatorId: searchUserId }
            ]
          },
          {
            tags: {
              some: {
                tagId: tagId
              }
            }
          }
        ]
      },
      include: {
        creator: {
          select: {
            username: true,
            displayName: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return companions.map(companion => ({
      id: companion.id,
      name: companion.name,
      description: companion.description,
      imageUrl: companion.imageUrl,
      isPublic: companion.isPublic,
      creator: {
        username: companion.creator.username,
        displayName: companion.creator.displayName
      },
      tags: companion.tags.map(ct => ({
        id: ct.tag.id,
        name: ct.tag.name
      }))
    }));
  } catch (error) {
    console.error("Companion search by tag error:", error);
    return [];
  }
}

/**
 * Get all available tags
 */
export async function getAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            companions: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ]
    });

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      companionCount: tag._count.companions
    }));
  } catch (error) {
    console.error("Get tags error:", error);
    return [];
  }
}

/**
 * Search tags by name
 */
export async function searchTags(query: string) {
  if (!query.trim()) return [];

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: {
            companions: true
          }
        }
      },
      orderBy: [
        { name: 'asc' }
      ],
      take: 10
    });

    return tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      companionCount: tag._count.companions
    }));
  } catch (error) {
    console.error("Search tags error:", error);
    return [];
  }
} 