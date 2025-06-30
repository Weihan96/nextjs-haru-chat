import { ChatMessage, ChatListDatum } from "@/types/chat";

export const MOCK_CHATS: ChatListDatum[] = [
  {
    id: "1",
    name: "Alena Moniaga",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",

    lastMessage: "What do you think about modern art?",
    timestamp: "10:30 AM",
    unread: true,
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Tom Lancaster",
    avatar: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",

    lastMessage: "The essence of consciousness is...",
    timestamp: "Yesterday",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Miko",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",

    lastMessage: "Let me help you debug that code.",
    timestamp: "Yesterday",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "4",
    name: "Sophia Chen",
    avatar: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c",

    lastMessage: "Have you read the latest research paper?",
    timestamp: "2 days ago",
    unread: true,
    unreadCount: 1,
  },
  {
    id: "5",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",

    lastMessage: "The quantum theory suggests that...",
    timestamp: "2 days ago",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "6",
    name: "Aisha Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",

    lastMessage: "I found some interesting patterns in the data.",
    timestamp: "3 days ago",
    unread: true,
    unreadCount: 5,
  },
  {
    id: "7",
    name: "Jamal Williams",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",

    lastMessage: "The historical context of this event is fascinating.",
    timestamp: "3 days ago",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "8",
    name: "Elena Rodriguez",
    avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43",

    lastMessage: "Let me tell you about Renaissance architecture.",
    timestamp: "4 days ago",
    unread: true,
    unreadCount: 2,
  },
  {
    id: "9",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",

    lastMessage: "The new AI model shows promising results.",
    timestamp: "5 days ago",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "10",
    name: "Maya Thompson",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",

    lastMessage: "Here are my thoughts on sustainable design.",
    timestamp: "1 week ago",
    unread: false,
    unreadCount: 0,
  },
  {
    id: "11",
    name: "Liam Parker",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",

    lastMessage: "The financial analysis shows a positive trend.",
    timestamp: "1 week ago",
    unread: true,
    unreadCount: 7,
  },
  {
    id: "12",
    name: "Olivia Martinez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",

    lastMessage: "Let me explain the legal implications.",
    timestamp: "2 weeks ago",
    unread: false,
    unreadCount: 0,
  },
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "m1",
      content:
        "Hello! I'm Alena. I'm passionate about art and literature. How can I assist you today?",
      isUser: false,
      timestamp: "10:25 AM",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    },
    {
      id: "m2",
      content:
        "Hi Alena! I'm interested in modern art but don't know much about it. Can you tell me more?",
      isUser: true,
      timestamp: "10:28 AM",
    },
    {
      id: "m3",
      content:
        "Of course! Modern art refers to artwork produced during the period roughly from the 1860s to the 1970s. It's characterized by a departure from traditional techniques and a focus on experimentation and self-expression. Some key movements include Impressionism, Cubism, Surrealism, and Abstract Expressionism. Any particular aspect you're curious about?",
      isUser: false,
      timestamp: "10:30 AM",
    },
  ],
  "2": [
    {
      id: "m1",
      content:
        "Greetings. I'm Tom Lancaster, a philosophical companion designed to explore deep questions about consciousness, reality, and human existence. What's on your mind today?",
      isUser: false,
      timestamp: "Yesterday, 3:15 PM",
    },
    {
      id: "m2",
      content:
        "I've been thinking about the nature of consciousness. What exactly is it?",
      isUser: true,
      timestamp: "Yesterday, 3:18 PM",
    },
    {
      id: "m3",
      content:
        "An excellent question. Consciousness is perhaps the greatest mystery in human experience. It's essentially our subjective awareness - the feeling of being you. While science can observe neural correlates of consciousness, the subjective experience itself - what philosophers call 'qualia' - remains elusive. This is what David Chalmers famously called 'the hard problem of consciousness'. Would you like me to elaborate on some theories about consciousness?",
      isUser: false,
      timestamp: "Yesterday, 3:22 PM",
    },
  ],
  "3": [
    {
      id: "m1",
      content:
        "Hi there! I'm Miko, your tech and coding companion. Whether you need help debugging code, learning a new programming language, or understanding tech concepts, I'm here to help!",
      isUser: false,
      timestamp: "Yesterday, 5:45 PM",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    },
    {
      id: "m2",
      content:
        "Hey Miko! I'm struggling with a JavaScript function. Can you help me debug it?",
      isUser: true,
      timestamp: "Yesterday, 5:47 PM",
    },
    {
      id: "m3",
      content:
        "Absolutely! Could you share the function that's giving you trouble? Also, let me know what it's supposed to do and what error you're encountering. That way, I can help you identify and fix the issue more effectively.",
      isUser: false,
      timestamp: "Yesterday, 5:50 PM",
    },
  ],
};

// Starred and saved items
export const STARRED_MESSAGES = [
  {
    id: "m1",
    title: "Alena Moniaga",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    content:
      'Impressionism began in the 1860s in Paris. The movement was characterized by small, visible brushstrokes that offered the bare impression of form, with an emphasis on accurate depiction of light and its changing qualities. The name came from Claude Monet\'s painting "Impression, Sunrise".',
    timestamp: "Jun 10, 2023",
  },
  {
    id: "m2",
    title: "Tom Lancaster",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    content:
      'The "hard problem of consciousness" refers to the challenge of explaining how and why physical processes in the brain give rise to subjective experience. While we can observe neural correlates of consciousness, the leap from physical processes to subjective experience remains philosophically challenging.',
    timestamp: "May 25, 2023",
  },
  {
    id: "m3",
    title: "Miko",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    content:
      "In React, the useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.",
    timestamp: "May 18, 2023",
  },
];

export const SAVED_HISTORY = [
  {
    id: "h1",
    title: "Art History Discussion",
    subtitle: "with Alena Moniaga",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    content:
      "We discussed the Renaissance period and its impact on modern art movements, especially focusing on the transition from classical to experimental techniques.",
    timestamp: "Jun 12, 2023",
  },
  {
    id: "h2",
    title: "Book Recommendations",
    subtitle: "with Alena Moniaga",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    content:
      "I suggested several novels based on your interest in magical realism, including works by Gabriel García Márquez and Haruki Murakami.",
    timestamp: "May 28, 2023",
  },
  {
    id: "h3",
    title: "Consciousness Exploration",
    subtitle: "with Tom Lancaster",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    content:
      "A deep dive into theories of consciousness, from philosophical zombies to the hard problem of qualia.",
    timestamp: "May 15, 2023",
  },
];

export const MOCK_CHAT_HISTORIES = [
  {
    id: "h1",
    title: "Art History Discussion",
    date: "Jun 12, 2023",
    snippet:
      "We discussed the Renaissance period and its impact on modern art...",
  },
  {
    id: "h2",
    title: "Book Recommendations",
    date: "May 28, 2023",
    snippet:
      "I suggested several novels based on your interest in magical realism...",
  },
  {
    id: "h3",
    title: "Painting Techniques",
    date: "Apr 15, 2023",
    snippet:
      "We explored different oil painting techniques and their applications...",
  },
  {
    id: "h4",
    title: "Creative Writing Tips",
    date: "Mar 03, 2023",
    snippet:
      "I provided guidance on developing complex characters and plot structures...",
  },
];
