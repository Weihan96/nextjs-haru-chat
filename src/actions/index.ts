// Export all search actions
export {
  globalSearch,
  searchCompanions,
  searchCompanionsByTag,
  searchUsers,
  searchMessages,
  searchCheckpoints,
  searchWithinChat,
  getAllTags,
  searchTags,
  type SearchResults,
} from "./search";

// Export companion management actions
export {
  createCompanion,
  updateCompanion,
  deleteCompanion,
  getCompanionWithTags,
  createTag,
  type CreateCompanionData,
  type UpdateCompanionData,
} from "./companions"; 