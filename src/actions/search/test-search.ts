/**
 * Test Script for Search Functionality
 * 
 * This demonstrates how to use the search actions once the database is seeded.
 * Run this after seeding the database to test the search functionality.
 */

// Example search queries that would work with our seeded data:

/**
 * 1. COMPANION SEARCH TESTS
 */

// Search for romantic companions
// globalSearch("romantic") would find:
// - Kai (romantic and charming AI companion)
// - Emma's VR Romance checkpoint

// Search for AI/tech companions  
// searchCompanions("AI neural") would find:
// - Luna (AI companion specializing in emotional support)
// - Zara (intelligent AI for discussions)

// Search for learning companions
// searchCompanions("learning education") would find:
// - Professor Arc (AI tutor for learning)

/**
 * 2. USER SEARCH TESTS
 */

// Search for developers
// searchUsers("software engineer") would find:
// - Alice Johnson (software engineer, AI & creative writing)

// Search for artists
// searchUsers("artist digital") would find:
// - Bob Chen (digital artist and storyteller)

// Search for writers
// searchUsers("writer romance") would find:
// - Emma Rodriguez (creative writer, romance novels)

/**
 * 3. MESSAGE SEARCH TESTS
 */

// Search for AI/ML conversations
// searchMessages("neural network transformer") would find:
// - Messages about transformer architectures
// - Discussion of self-attention mechanisms
// - BERT and neural network conversations

// Search for creative content
// searchMessages("writing story artificial intelligence") would find:
// - Conversations about AI-human connection stories
// - Writer's block discussions
// - Creative writing sessions

// Search for romance topics
// searchMessages("virtual reality love romance") would find:
// - VR romance novel discussions
// - Emotional connection conversations
// - Digital relationships

/**
 * 4. CHECKPOINT SEARCH TESTS
 */

// Search for AI development checkpoints
// searchCheckpoints("neural network AI") would find:
// - "Neural Network Breakthrough" checkpoint
// - AI development discussions

// Search for writing checkpoints
// searchCheckpoints("romance VR writing") would find:
// - "Virtual Reality Romance Concept" checkpoint
// - Creative writing inspiration

/**
 * 5. CHAT-SPECIFIC SEARCH TESTS
 */

// Search within Alice's AI development chat
// searchWithinChat(chat_id, "transformer attention") would find:
// - Messages about transformer architectures
// - Self-attention mechanism discussions

/**
 * 6. GLOBAL SEARCH EXAMPLES
 */

// Search for "romance" across all content types would return:
const exampleRomanceSearch = {
  companions: [
    // Kai - romantic AI companion
  ],
  users: [
    // Emma Rodriguez - romance writer
  ],
  messages: [
    // VR romance novel discussions
    // Emotional connection messages
  ],
  checkpoints: [
    // "Virtual Reality Romance Concept"
  ]
};

// Search for "AI" across all content types would return:
const exampleAISearch = {
  companions: [
    // Luna, Zara, Professor Arc
  ],
  users: [
    // Alice Johnson - AI engineer
  ],
  messages: [
    // Neural network discussions
    // AI-human connection conversations
  ],
  checkpoints: [
    // "Neural Network Breakthrough"
    // "Creative Writing Inspiration"
  ]
};

/**
 * 7. ADVANCED SEARCH EXAMPLES
 */

// PostgreSQL full-text search operators that work:
// - "AI & neural" (AND operator)
// - "romance | love" (OR operator)  
// - "AI & !programming" (NOT operator)
// - "roman*" (prefix matching - finds romantic, romance)

export const searchTestExamples = {
  companionSearches: [
    "romantic charming",
    "intelligent brainstorming", 
    "emotional support",
    "learning education tutor",
    "mindfulness meditation"
  ],
  
  userSearches: [
    "software engineer",
    "digital artist",
    "romance writer",
    "creative writing"
  ],
  
  messageSearches: [
    "neural network transformer",
    "artificial intelligence friendship",
    "virtual reality love",
    "JavaScript closures",
    "writer block creativity"
  ],
  
  checkpointSearches: [
    "AI development breakthrough",
    "romance VR concept",
    "creative writing inspiration"
  ],
  
  globalSearches: [
    "romance",
    "AI neural",
    "creative writing",
    "digital art",
    "learning education"
  ]
};

/**
 * Usage Example:
 * 
 * import { globalSearch, searchCompanions } from "@/actions";
 * 
 * // Search for romantic content
 * const results = await globalSearch("romance");
 * console.log(results);
 * 
 * // Search for AI companions
 * const companions = await searchCompanions("intelligent brainstorming");
 * console.log(companions);
 */ 