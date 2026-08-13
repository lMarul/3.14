import type { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  recipientName: 'Pia',
  senderName: 'Me',
  questionText: 'May I take you out for a cup of coffee?',
  quizTitle: 'Identity Verification Check',
  quizQuestions: [
    {
      id: 1,
      question: "What is Pia's favorite emoji?",
      options: [
        "🐋",
        "☕",
        "💖",
        "🌸"
      ],
      correctIndex: 0,
      correctComment: "Bingo! You got it right! 🐋💙",
      wrongComment: "It's okay! I'll let you pass anyway 😉"
    },
    {
      id: 2,
      question: "Pia plays in a band, what instrument does she mainly use?",
      options: [
        "🎸",
        "🥁",
        "🎹",
        "🎤"
      ],
      correctIndex: 0,
      correctComment: "Bingo! You know she rocks on the bass! 🎸⚡",
      wrongComment: "It's okay! She plays the bass like a rockstar, but I'll let you pass 😉"
    },
    {
      id: 3,
      question: "Why does she prefer drinking from bottles instead of the school's water fountain?",
      options: [
        "She saw someone put their mouth directly to it when drinking 🤮",
        "She thinks water bottle stickers look cooler 🏷️",
        "She prefers ice-cold water from home 🧊",
        "She heard school water tastes like pennies 🪙"
      ],
      correctIndex: 0,
      correctComment: "Eww gross! 🤮 You actually remembered that traumatizing fountain moment!",
      wrongComment: "Nope! She literally saw someone put their mouth directly to the water fountain when drinking 🤮"
    },
    {
      id: 4,
      question: "Are you ready to unlock this note?",
      options: [
        "Yes! Show me 💕",
        "100% Ready ☕",
        "Super Excited ✨",
        "Let's Go! 🚀"
      ],
      correctIndex: 0,
      correctComment: "Access Granted! ❤️",
      wrongComment: "Take a deep breath, access granted 💕"
    }
  ],
  evasiveNoButton: true,
  adminPasscode: '1234',
  coffeeLocation: {
    name: 'Artisan Roast & Bakery',
    address: '142 Heartwood Lane, Downtown',
    lat: 40.73061,
    lng: -73.935242,
    googleMapsUrl: 'https://maps.google.com/?q=40.73061,-73.935242',
    note: 'Cozy fireplace seating & fresh hand-poured coffee! ☕✨',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800'
  },
  slides: [
    {
      id: 1,
      title: 'Hey there...',
      content: 'I know its kind of sudden and this may come as a surprise to you, but yeah.',
      revealText: 'I like you...',
      iconName: 'sparkles'
    },
    {
      id: 2,
      content: 'It\'s been a long time that we\'ve known each other, its also been a long time since I\'ve held these feelings to myself.',
      iconName: 'heart'
    },
    {
      id: 3,
      content: 'I truly appreciate every interactions we\'ve ever had, no matter how small they may seem.',
      iconName: 'smile'
    },
    {
      id: 4,
      content: 'You\'ve inspired me numerous times. You have been the reason for me to keep moving forward no matter how difficult it gets.',
      videoPlaceholderLabel: 'Gagawin ko ang lahat pati ang thesis mo vid',
      iconName: 'star'
    },
    {
      id: 5,
      content: 'The reason for me try new things that looks interesting.',
      videoPlaceholderLabel: 'Guitar vids',
      iconName: 'coffee'
    },
    {
      id: 6,
      content: 'The reason for me to make efforts to be the best version of myself.',
      customEmoji: '🖐️',
      iconName: 'heart'
    },
    {
      id: 7,
      title: 'Behold...',
      iconName: 'sparkles'
    },
    {
      id: 8,
      title: 'The things that remind me of you',
      iconName: 'star',
      beholdGrid: [
        { label: 'Blue Whales', symbol: '🐋', color: 'from-blue-600/40 to-cyan-500/40 border-cyan-300/40 text-cyan-200', tag: 'Blue Whales' },
        { label: 'The Color Red', symbol: '🔴', color: 'from-red-600/40 to-rose-500/40 border-rose-300/40 text-rose-200', tag: 'Crimson Red' },
        { label: '3.14', symbol: '🥧', color: 'from-amber-600/40 to-yellow-500/40 border-amber-300/40 text-amber-200', tag: '3.14' },
        { label: 'Pi Symbol', symbol: 'π', color: 'from-purple-600/40 to-pink-500/40 border-purple-300/40 text-purple-200', tag: 'Pi (π)' },
        { label: 'Bass', symbol: '🎸', color: 'from-indigo-600/40 to-blue-500/40 border-indigo-300/40 text-indigo-200', tag: 'Bass Guitar' },
        { label: 'Kirby', symbol: '🌸', color: 'from-pink-600/40 to-rose-400/40 border-pink-300/40 text-pink-200', tag: 'Kirby 💖' }
      ]
    }
  ]
};
