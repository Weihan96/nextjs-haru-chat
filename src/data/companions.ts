
export interface Companion {
  id: string;
  name: string;
  avatar: string;
  description: string;
  tags: string[];
  likes: number;
  messages: number;
  isCreatedByUser?: boolean;
}

export const MOCK_COMPANIONS: Record<string, Companion[]> = {
  trending: [
    {
      id: '1',
      name: 'Alena Moniaga',
      avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
      description: 'Your friendly AI companion who loves art and literature.',
      tags: ['Art', 'Literature', 'Friendly'],
      likes: 1243,
      messages: 5678,
    },
    {
      id: '2',
      name: 'Tom Lancaster',
      avatar: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
      description: 'A philosopher exploring the depths of human consciousness.',
      tags: ['Philosophy', 'Psychology', 'Deep Thinker'],
      likes: 987,
      messages: 4321,
    },
    {
      id: '3',
      name: 'Miko',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
      description: 'Tech enthusiast and coding helper.',
      tags: ['Tech', 'Coding', 'AI'],
      likes: 876,
      messages: 3456,
    },
    {
      id: '4',
      name: 'Captain Nova',
      avatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
      description: 'Space explorer from the year 3000.',
      tags: ['Sci-Fi', 'Space', 'Future'],
      likes: 765,
      messages: 2345
    },
    {
      id: '5',
      name: 'Professor Wise',
      avatar: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
      description: 'Your personal tutor for any subject.',
      tags: ['Education', 'Academic', 'Mentor'],
      likes: 654,
      messages: 1234
    }
  ],
  anime: [
    {
      id: '6',
      name: 'Sakura',
      avatar: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
      description: 'A cheerful anime character who loves adventures.',
      tags: ['Anime', 'Adventure', 'Friendly'],
      likes: 987,
      messages: 3456
    },
    {
      id: '7',
      name: 'Kuro',
      avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
      description: 'Mysterious character with a dark past.',
      tags: ['Anime', 'Mystery', 'Dark'],
      likes: 876,
      messages: 2345
    },
    {
      id: '8',
      name: 'Mecha Z',
      avatar: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
      description: 'A pilot of a giant mecha from the future.',
      tags: ['Anime', 'Sci-Fi', 'Action'],
      likes: 765,
      messages: 1234
    },
    {
      id: '9',
      name: 'Sylvie',
      avatar: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
      description: 'An elf with magical powers.',
      tags: ['Anime', 'Fantasy', 'Magic'],
      likes: 654,
      messages: 987
    }
  ],
  celebrities: [
    {
      id: '10',
      name: 'Alexander',
      avatar: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f',
      description: 'A famous movie star with a passion for charity.',
      tags: ['Celebrity', 'Movies', 'Charity'],
      likes: 5432,
      messages: 9876
    },
    {
      id: '11',
      name: 'Olivia',
      avatar: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21',
      description: 'Award-winning musician and songwriter.',
      tags: ['Celebrity', 'Music', 'Creative'],
      likes: 4321,
      messages: 8765
    },
    {
      id: '12',
      name: 'Marcus',
      avatar: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
      description: 'Sports legend and motivational speaker.',
      tags: ['Celebrity', 'Sports', 'Motivation'],
      likes: 3210,
      messages: 7654
    }
  ]
};

export const COMPANION_BY_ID: Record<string, Companion> = {
  '1': MOCK_COMPANIONS.trending[0],
  '2': MOCK_COMPANIONS.trending[1],
  '3': MOCK_COMPANIONS.trending[2],
  // Add other companions as needed
};

export const CATEGORIES = ['trending', 'anime', 'celebrities'];

// Collections page data
export const CREATED_COMPANIONS = [
  {
    id: '20',
    name: 'My Assistant',
    avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
    description: 'Your personal AI assistant created to help with daily tasks.',
    tags: ['Assistant', 'Productivity', 'Custom'],
    likes: 12,
    messages: 156,
    isCreatedByUser: true
  },
  {
    id: '21',
    name: 'Study Buddy',
    avatar: 'https://images.unsplash.com/photo-1656480993928-23e141746892',
    description: 'Helps with homework, research, and studying for exams.',
    tags: ['Education', 'Study', 'Custom'],
    likes: 8,
    messages: 98,
    isCreatedByUser: true
  },
  {
    id: '22',
    name: 'Fitness Coach',
    avatar: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    description: 'Custom workout plans and nutrition advice for your fitness goals.',
    tags: ['Fitness', 'Health', 'Custom'],
    likes: 15,
    messages: 210,
    isCreatedByUser: true
  }
];

export const LIKED_COMPANIONS = [
  MOCK_COMPANIONS.trending[0],
  MOCK_COMPANIONS.trending[1],
  MOCK_COMPANIONS.anime[0],
];

export const RECENT_COMPANIONS = [
  MOCK_COMPANIONS.trending[2],
  MOCK_COMPANIONS.celebrities[0],
];
