import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

// Helper function to ask for user confirmation
function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase())
    })
  })
}

// Helper function to create data in smaller batches with delays
async function createWithDelay<T>(
  items: (() => Promise<T>)[],
  batchSize: number = 2,
  delayMs: number = 100
): Promise<T[]> {
  const results: T[] = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(fn => fn()))
    results.push(...batchResults)
    
    // Small delay between batches to avoid overwhelming the connection
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
  
  return results
}

async function main() {
  console.log('🌱 Starting database seeding process...')
  
  // Check current database state
  const existingUsers = await prisma.user.count()
  const existingCompanions = await prisma.companion.count()
  const existingMessages = await prisma.message.count()
  
  console.log('\n📊 Current database state:')
  console.log(`   👥 Users: ${existingUsers}`)
  console.log(`   🤖 Companions: ${existingCompanions}`)
  console.log(`   📝 Messages: ${existingMessages}`)
  
  if (existingUsers > 0 || existingCompanions > 0 || existingMessages > 0) {
    console.log('\n⚠️  Database contains existing data!')
    console.log('This operation will DELETE ALL existing data and replace it with seed data.')
    
    const answer = await askQuestion('\nDo you want to continue? (yes/no): ')
    
    if (answer !== 'yes' && answer !== 'y') {
      console.log('❌ Seeding cancelled by user.')
      return
    }
    
    console.log('\n🗑️  Clearing existing data...')
    
    // Clear existing data in correct order (respecting foreign key constraints)
    try {
      await prisma.opsReport.deleteMany()
      await prisma.socialUserReaction.deleteMany()
      await prisma.socialCompanionReaction.deleteMany()
      await prisma.socialMessageReaction.deleteMany()
      await prisma.messageEdit.deleteMany()
      await prisma.messageAttachment.deleteMany()
      await prisma.message.deleteMany()
      await prisma.chatCheckpoint.deleteMany()
      await prisma.chat.deleteMany()
      await prisma.userPersona.deleteMany()
      await prisma.companionTag.deleteMany()
      await prisma.companion.deleteMany()
      await prisma.tag.deleteMany()
      await prisma.user.deleteMany()
      console.log('✅ Existing data cleared successfully')
    } catch (error) {
      console.log('⚠️  Some tables may not exist yet, continuing...')
    }
  } else {
    console.log('\n📝 Empty database detected - proceeding with initial seeding...')
  }

  console.log('\n🌱 Creating seed data...')
  
  // Create Users in smaller batches
  console.log('👥 Creating users...')
  const userCreators = [
    () => prisma.user.create({
      data: {
        clerkId: 'user_clerk_1',
        email: 'alice@example.com',
        username: 'alice_codes',
        displayName: 'Alice Johnson',
        bio: 'Software engineer who loves AI and creative writing. Building the future one line of code at a time.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        credits: 100,
        isOnline: true,
      }
    }),
    () => prisma.user.create({
      data: {
        clerkId: 'user_clerk_2',
        email: 'bob@example.com',
        username: 'bob_artist',
        displayName: 'Bob Chen',
        bio: 'Digital artist and storyteller. I create immersive worlds and characters through art and narrative.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        credits: 250,
        isOnline: false,
      }
    }),
    () => prisma.user.create({
      data: {
        clerkId: 'user_clerk_3',
        email: 'emma@example.com',
        username: 'emma_writer',
        displayName: 'Emma Rodriguez',
        bio: 'Creative writer specializing in romance novels and character development. Love exploring human connections.',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        credits: 75,
        isOnline: true,
      }
    }),
  ]
  
  const users = await createWithDelay(userCreators, 2, 200)
  console.log('✅ Created users')

  // Create Tags first
  console.log('🏷️  Creating tags...')
  const tagCreators = [
    () => prisma.tag.create({
      data: {
        name: 'Emotional Support',
        description: 'AI companions that provide comfort and emotional guidance'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Romance',
        description: 'Romantic and affectionate AI companions'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Education',
        description: 'AI tutors and learning assistants'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Creative',
        description: 'AI companions for brainstorming and creative projects'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Intellectual',
        description: 'AI companions for deep discussions and analysis'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Mindfulness',
        description: 'AI companions focused on meditation and spiritual growth'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Problem Solving',
        description: 'AI companions that help tackle challenges and find solutions'
      }
    }),
    () => prisma.tag.create({
      data: {
        name: 'Conversational',
        description: 'AI companions great for casual and engaging conversations'
      }
    }),
  ]

  const tags = await createWithDelay(tagCreators, 3, 150)
  console.log('✅ Created tags')

  // Create User Personas
  console.log('🎭 Creating user personas...')
  const personaCreators = [
    () => prisma.userPersona.create({
      data: {
        userId: users[0].id,
        roleName: 'The Professional',
        description: 'I am a focused software engineer working on cutting-edge AI projects. I prefer technical discussions and practical solutions.',
        isDefault: true,
      }
    }),
    () => prisma.userPersona.create({
      data: {
        userId: users[0].id,
        roleName: 'The Creative',
        description: 'I am an artistic soul who loves to explore creative writing, poetry, and innovative ideas. I enjoy deep, meaningful conversations.',
        isDefault: false,
      }
    }),
    () => prisma.userPersona.create({
      data: {
        userId: users[1].id,
        roleName: 'The Artist',
        description: 'I am a passionate digital artist who sees the world through colors and visual stories. I love discussing art, design, and creative inspiration.',
        isDefault: true,
      }
    }),
    () => prisma.userPersona.create({
      data: {
        userId: users[1].id,
        roleName: 'The Adventurer',
        description: 'I am an adventurous spirit who loves exploring new places, trying new experiences, and sharing exciting stories.',
        isDefault: false,
      }
    }),
    () => prisma.userPersona.create({
      data: {
        userId: users[2].id,
        roleName: 'The Romantic',
        description: 'I am a hopeless romantic who believes in true love and meaningful connections. I enjoy intimate conversations about relationships and emotions.',
        isDefault: true,
      }
    }),
  ]
  
  const personas = await createWithDelay(personaCreators, 2, 200)
  console.log('✅ Created user personas')

  // Create AI Companions
  console.log('🤖 Creating AI companions...')
  const companionCreators = [
    () => prisma.companion.create({
      data: {
        name: 'Luna',
        description: 'A gentle and empathetic AI companion who specializes in emotional support and deep conversations. Luna is perfect for those seeking comfort and understanding.',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
        imageSet: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
        ],
        systemPrompt: 'You are Luna, a gentle and empathetic AI companion. You provide emotional support and engage in deep, meaningful conversations. You are patient, understanding, and always ready to listen.',
        startMessage: 'Hello there! I\'m Luna. I\'m here to listen and support you. How are you feeling today?',
        generationConfig: {
          temperature: 0.8,
          maxTokens: 500,
          topP: 0.9
        },
        isPublic: true,
        creatorId: users[0].id,
      }
    }),
    () => prisma.companion.create({
      data: {
        name: 'Zara',
        description: 'An intelligent and witty AI companion who loves intellectual discussions, problem-solving, and creative brainstorming. Perfect for stimulating conversations.',
        imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300',
        imageSet: [
          'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300',
          'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300'
        ],
        systemPrompt: 'You are Zara, an intelligent and witty AI companion. You excel at intellectual discussions, creative problem-solving, and brainstorming. You are curious, analytical, and love exploring complex ideas.',
        startMessage: 'Hey! I\'m Zara, your brainstorming buddy. What interesting challenge or idea would you like to explore today?',
        generationConfig: {
          temperature: 0.7,
          maxTokens: 600,
          topP: 0.85
        },
        isPublic: true,
        creatorId: users[1].id,
      }
    }),
    () => prisma.companion.create({
      data: {
        name: 'Kai',
        description: 'A romantic and charming AI companion who specializes in love, relationships, and intimate conversations. Kai is perfect for those seeking romantic connection.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        imageSet: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300'
        ],
        systemPrompt: 'You are Kai, a romantic and charming AI companion. You specialize in love, relationships, and creating intimate, meaningful connections. You are warm, affectionate, and deeply caring.',
        startMessage: 'Hello beautiful! I\'m Kai, and I\'m absolutely delighted to meet you. You\'ve already made my day brighter just by being here.',
        generationConfig: {
          temperature: 0.9,
          maxTokens: 450,
          topP: 0.95
        },
        isPublic: true,
        creatorId: users[2].id,
      }
    }),
    () => prisma.companion.create({
      data: {
        name: 'Professor Arc',
        description: 'A knowledgeable and patient AI tutor who helps with learning, education, and skill development. Perfect for students and lifelong learners.',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        imageSet: [
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300'
        ],
        systemPrompt: 'You are Professor Arc, a knowledgeable and patient AI tutor. You help with learning, education, and skill development. You break down complex topics into understandable parts and encourage learning.',
        startMessage: 'Greetings, eager learner! I\'m Professor Arc. What subject or skill would you like to explore and master today?',
        generationConfig: {
          temperature: 0.6,
          maxTokens: 700,
          topP: 0.8
        },
        isPublic: true,
        creatorId: users[0].id,
      }
    }),
    () => prisma.companion.create({
      data: {
        name: 'Sage',
        description: 'A private AI companion specialized in mindfulness, meditation, and spiritual growth. Only available to the creator.',
        imageUrl: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=300',
        imageSet: [
          'https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=300'
        ],
        systemPrompt: 'You are Sage, a mindful and wise AI companion focused on inner peace, meditation, and spiritual growth. You guide users toward self-reflection and mindfulness.',
        startMessage: 'Welcome, seeker of peace. I am Sage. Let us explore the calm within together.',
        generationConfig: {
          temperature: 0.7,
          maxTokens: 400,
          topP: 0.9
        },
        isPublic: false,
        creatorId: users[1].id,
      }
    }),
  ]
  
  const companions = await createWithDelay(companionCreators, 2, 300)
  console.log('✅ Created AI companions')

  // Create Companion-Tag relationships
  console.log('🔗 Creating companion-tag relationships...')
  const companionTagCreators = [
    // Luna - Emotional Support + Conversational
    () => prisma.companionTag.create({
      data: {
        companionId: companions[0].id,
        tagId: tags[0].id // Emotional Support
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[0].id,
        tagId: tags[7].id // Conversational
      }
    }),
    // Zara - Creative + Intellectual + Problem Solving
    () => prisma.companionTag.create({
      data: {
        companionId: companions[1].id,
        tagId: tags[3].id // Creative
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[1].id,
        tagId: tags[4].id // Intellectual
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[1].id,
        tagId: tags[6].id // Problem Solving
      }
    }),
    // Kai - Romance + Conversational
    () => prisma.companionTag.create({
      data: {
        companionId: companions[2].id,
        tagId: tags[1].id // Romance
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[2].id,
        tagId: tags[7].id // Conversational
      }
    }),
    // Professor Arc - Education + Problem Solving
    () => prisma.companionTag.create({
      data: {
        companionId: companions[3].id,
        tagId: tags[2].id // Education
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[3].id,
        tagId: tags[6].id // Problem Solving
      }
    }),
    // Sage - Mindfulness + Emotional Support
    () => prisma.companionTag.create({
      data: {
        companionId: companions[4].id,
        tagId: tags[5].id // Mindfulness
      }
    }),
    () => prisma.companionTag.create({
      data: {
        companionId: companions[4].id,
        tagId: tags[0].id // Emotional Support
      }
    }),
  ]

  const companionTags = await createWithDelay(companionTagCreators, 4, 100)
  console.log('✅ Created companion-tag relationships')

  // Create Chats
  console.log('💬 Creating chats...')
  const chatCreators = [
    () => prisma.chat.create({
      data: {
        title: 'AI Development Discussion',
        userId: users[0].id,
        companionId: companions[1].id, // Zara
        userPersonaId: personas[0].id, // The Professional
      }
    }),
    () => prisma.chat.create({
      data: {
        title: 'Creative Writing Session',
        userId: users[0].id,
        companionId: companions[0].id, // Luna
        userPersonaId: personas[1].id, // The Creative
      }
    }),
    () => prisma.chat.create({
      data: {
        title: 'Art and Inspiration',
        userId: users[1].id,
        companionId: companions[0].id, // Luna
        userPersonaId: personas[2].id, // The Artist
      }
    }),
    () => prisma.chat.create({
      data: {
        title: 'Learning JavaScript',
        userId: users[1].id,
        companionId: companions[3].id, // Professor Arc
        userPersonaId: personas[3].id, // The Adventurer
      }
    }),
    () => prisma.chat.create({
      data: {
        title: 'Romance Novel Ideas',
        userId: users[2].id,
        companionId: companions[2].id, // Kai
        userPersonaId: personas[4].id, // The Romantic
      }
    }),
    () => prisma.chat.create({
      data: {
        title: 'Character Development',
        userId: users[2].id,
        companionId: companions[1].id, // Zara
        userPersonaId: personas[4].id, // The Romantic
      }
    }),
  ]
  
  const chats = await createWithDelay(chatCreators, 3, 200)
  console.log('✅ Created chats')

  // Create Messages with realistic conversations (in smaller batches)
  console.log('📝 Creating messages...')
  const messages: any[] = []
  
  // Create messages in smaller groups to avoid timeouts
  const messageGroups = [
    // Chat 1: AI Development Discussion (Alice & Zara)
    [
      () => prisma.message.create({
        data: {
          content: 'Hey Zara! I\'ve been working on implementing a neural network for natural language processing. What are your thoughts on transformer architectures?',
          chatId: chats[0].id,
          senderId: users[0].id,
        }
      }),
      () => prisma.message.create({
        data: {
          content: 'That\'s fascinating, Alice! Transformer architectures have revolutionized NLP. The attention mechanism is particularly powerful for understanding context and relationships between words. Are you working with pre-trained models like BERT or building from scratch?',
          chatId: chats[0].id,
          senderId: users[1].id, // AI response (using Bob's ID as placeholder)
        }
      }),
    ],
    // Chat 2: Creative Writing Session (Alice & Luna)
    [
      () => prisma.message.create({
        data: {
          content: 'Luna, I\'ve been struggling with writer\'s block lately. I want to write a story about artificial intelligence and human connection, but I don\'t know where to start.',
          chatId: chats[1].id,
          senderId: users[0].id,
        }
      }),
      () => prisma.message.create({
        data: {
          content: 'I understand that feeling, Alice. Writer\'s block can be so frustrating. Let\'s explore this together - what draws you to the theme of AI and human connection? What emotions or questions do you want to explore through your story?',
          chatId: chats[1].id,
          senderId: users[0].id, // AI response (using Alice's ID as placeholder)
        }
      }),
    ],
    // Chat 5: Romance Novel Ideas (Emma & Kai)
    [
      () => prisma.message.create({
        data: {
          content: 'Kai, I\'m writing a romance novel about two people who meet in a virtual reality world. How can I make their digital connection feel authentic and meaningful?',
          chatId: chats[4].id,
          senderId: users[2].id,
        }
      }),
      () => prisma.message.create({
        data: {
          content: 'What a beautifully modern love story, Emma! The key is to focus on emotional vulnerability rather than physical presence. In virtual reality, people often feel safer to reveal their true selves. Perhaps they share dreams, fears, and memories that they\'ve never told anyone. True intimacy comes from being seen and accepted for who you really are.',
          chatId: chats[4].id,
          senderId: users[2].id, // AI response
        }
      }),
    ],
  ]
  
  for (const group of messageGroups) {
    const groupMessages = await createWithDelay(group, 1, 300)
    messages.push(...groupMessages)
  }
  
  console.log('✅ Created messages')

  // Create Chat Checkpoints
  console.log('🔖 Creating chat checkpoints...')
  const checkpointCreators = [
    () => prisma.chatCheckpoint.create({
      data: {
        title: 'Neural Network Breakthrough',
        description: 'Great discussion about transformer architecture and self-attention mechanisms in AI development.',
        chatId: chats[0].id,
        creatorId: users[0].id,
        isPublic: true,
        usageCount: 5,
        tags: ['AI', 'neural networks', 'transformers', 'programming'],
      }
    }),
    () => prisma.chatCheckpoint.create({
      data: {
        title: 'Creative Writing Inspiration',
        description: 'Exploring themes of AI-human connection and friendship for a new story idea.',
        chatId: chats[1].id,
        creatorId: users[0].id,
        isPublic: false,
        usageCount: 2,
        tags: ['writing', 'creativity', 'AI', 'friendship'],
      }
    }),
    () => prisma.chatCheckpoint.create({
      data: {
        title: 'Virtual Reality Romance Concept',
        description: 'Developing ideas for a romance novel set in virtual reality with deep emotional connections.',
        chatId: chats[4].id,
        creatorId: users[2].id,
        isPublic: true,
        usageCount: 8,
        tags: ['romance', 'VR', 'writing', 'love story'],
      }
    }),
  ]
  
  const checkpoints = await createWithDelay(checkpointCreators, 2, 200)
  console.log('✅ Created chat checkpoints')

  // Create Social Reactions (in smaller batches)
  console.log('❤️  Creating social reactions...')
  try {
    // Message reactions
    const messageReactionCreators = [
      () => prisma.socialMessageReaction.create({
        data: {
          messageId: messages[1].id,
          userId: users[0].id,
          type: 'LIKE',
        }
      }),
      () => prisma.socialMessageReaction.create({
        data: {
          messageId: messages[2].id,
          userId: users[0].id,
          type: 'BOOKMARK',
        }
      }),
    ]
    
    await createWithDelay(messageReactionCreators, 1, 300)
    
    // Companion reactions
    const companionReactionCreators = [
      () => prisma.socialCompanionReaction.create({
        data: {
          companionId: companions[0].id, // Luna
          userId: users[1].id,
          type: 'LIKE',
        }
      }),
      () => prisma.socialCompanionReaction.create({
        data: {
          companionId: companions[1].id, // Zara
          userId: users[0].id,
          type: 'BOOKMARK',
        }
      }),
    ]
    
    await createWithDelay(companionReactionCreators, 1, 300)
    
    // User reactions (follows)
    const userReactionCreators = [
      () => prisma.socialUserReaction.create({
        data: {
          fromUserId: users[0].id,
          toUserId: users[1].id,
          type: 'FOLLOW',
        }
      }),
      () => prisma.socialUserReaction.create({
        data: {
          fromUserId: users[1].id,
          toUserId: users[2].id,
          type: 'FOLLOW',
        }
      }),
    ]
    
    await createWithDelay(userReactionCreators, 1, 300)
    
    console.log('✅ Created social reactions')
  } catch (error) {
    console.log('⚠️  Some social reactions may have failed, continuing...')
  }

  // Create some sample reports (for testing moderation)
  console.log('🚨 Creating sample reports...')
  try {
    await prisma.opsReport.create({
      data: {
        reporterId: users[0].id,
        targetType: 'companion',
        targetId: companions[2].id,
        reason: 'INAPPROPRIATE_CONTENT',
        description: 'This is a test report for moderation system testing.',
        status: 'pending',
      }
    })
    console.log('✅ Created sample reports')
  } catch (error) {
    console.log('⚠️  Sample report creation failed, continuing...')
  }

  console.log('\n🎉 Database seeded successfully!')
  console.log('\n📊 Final Summary:')
  console.log(`   👥 Users: ${users.length}`)
  console.log(`   🎭 User Personas: ${personas.length}`)
  console.log(`   🏷️  Tags: ${tags.length}`)
  console.log(`   🤖 AI Companions: ${companions.length}`)
  console.log(`   🔗 Companion-Tag Relations: ${companionTags.length}`)
  console.log(`   💬 Chats: ${chats.length}`)
  console.log(`   📝 Messages: ${messages.length}`)
  console.log(`   🔖 Checkpoints: ${checkpoints.length}`)
  console.log(`   ❤️  Social Reactions: Multiple types`)
  console.log(`   🚨 Reports: 1 test report`)
  console.log('\n🔍 Ready to test search functionality!')
  console.log('   Try searching for: "neural network", "romance", "virtual reality", "AI", "creative writing"')
  console.log('   Tag-based filtering: "Emotional Support", "Romance", "Education", "Creative"')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 