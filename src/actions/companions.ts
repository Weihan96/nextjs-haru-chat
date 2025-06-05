"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export interface CreateCompanionData {
  name: string;
  description?: string;
  imageUrl?: string;
  imageSet?: string[];
  systemPrompt: string;
  startMessage: string;
  generationConfig: object;
  isPublic?: boolean;
  tagIds?: string[];
}

export interface UpdateCompanionData extends Partial<CreateCompanionData> {
  id: string;
}

/**
 * Create a new companion with tags
 */
export async function createCompanion(data: CreateCompanionData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const companion = await prisma.companion.create({
      data: {
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
        imageSet: data.imageSet || [],
        systemPrompt: data.systemPrompt,
        startMessage: data.startMessage,
        generationConfig: data.generationConfig,
        isPublic: data.isPublic || false,
        creatorId: user.id,
        // Create tag relationships if tagIds provided
        ...(data.tagIds && data.tagIds.length > 0 && {
          tags: {
            create: data.tagIds.map(tagId => ({
              tagId
            }))
          }
        })
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
      }
    });

    revalidatePath("/");
    return companion;
  } catch (error) {
    console.error("Create companion error:", error);
    throw new Error("Failed to create companion");
  }
}

/**
 * Update an existing companion and its tags
 */
export async function updateCompanion(data: UpdateCompanionData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user owns the companion
    const existingCompanion = await prisma.companion.findUnique({
      where: { id: data.id },
      select: { creatorId: true }
    });

    if (!existingCompanion || existingCompanion.creatorId !== user.id) {
      throw new Error("Companion not found or access denied");
    }

    const { id, tagIds, ...updateData } = data;

    const companion = await prisma.companion.update({
      where: { id },
      data: {
        ...updateData,
        // Handle tag updates if provided
        ...(tagIds !== undefined && {
          tags: {
            // Delete existing tag relationships
            deleteMany: {},
            // Create new tag relationships
            create: tagIds.map(tagId => ({
              tagId
            }))
          }
        })
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
      }
    });

    revalidatePath("/");
    return companion;
  } catch (error) {
    console.error("Update companion error:", error);
    throw new Error("Failed to update companion");
  }
}

/**
 * Delete a companion
 */
export async function deleteCompanion(companionId: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user owns the companion
    const existingCompanion = await prisma.companion.findUnique({
      where: { id: companionId },
      select: { creatorId: true }
    });

    if (!existingCompanion || existingCompanion.creatorId !== user.id) {
      throw new Error("Companion not found or access denied");
    }

    await prisma.companion.delete({
      where: { id: companionId }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete companion error:", error);
    throw new Error("Failed to delete companion");
  }
}

/**
 * Get a companion with its tags
 */
export async function getCompanionWithTags(companionId: string) {
  const { userId } = await auth();

  try {
    const companion = await prisma.companion.findUnique({
      where: { id: companionId },
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
                name: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!companion) {
      throw new Error("Companion not found");
    }

    // Check access permissions
    if (!companion.isPublic && (!userId || companion.creatorId !== userId)) {
      throw new Error("Access denied");
    }

    return companion;
  } catch (error) {
    console.error("Get companion error:", error);
    throw new Error("Failed to get companion");
  }
}

/**
 * Create a new tag
 */
export async function createTag(name: string, description?: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        description: description?.trim()
      }
    });

    return tag;
  } catch (error) {
    console.error("Create tag error:", error);
    throw new Error("Failed to create tag");
  }
} 