import type { AppConfig } from './types';

export const defaultConfig: AppConfig = {
  recipientName: 'Pia',
  senderName: 'Me',
  questionText: 'May I take you out for a cup of coffee?',
  quizTitle: 'Are you really Pia?',
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
      question: "Are you ready to read this small note crafted just for you?",
      options: [
        "Yes! Show me 💕",
        "100% Ready ☕",
        "Super Excited ✨",
        "Let's Go! 🚀"
      ],
      correctIndex: 0,
      correctComment: "Here we go! ❤️",
      wrongComment: "It's okay! Take a deep breath, here we go 💕"
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
      subtitle: 'A small note crafted just for you',
      content: 'I wanted to share something that has been on my mind for a while now. Life gets wonderfully busy, but certain people always manage to stand out in the brightest way.',
      quote: '"The best things in life are even better when shared."',
      iconName: 'sparkles'
    },
    {
      id: 2,
      title: 'Moments That Matter',
      subtitle: 'Simple joys and genuine conversations',
      content: 'Every time we talk, I find myself admiring your kindness, your sense of humor, and how effortlessly comfortable it feels to be around you.',
      quote: '"A warm conversation can make an entire week feel special."',
      iconName: 'heart'
    },
    {
      id: 3,
      title: 'No Pressure, Just Warmth',
      subtitle: 'A genuine invitation',
      content: 'I cherish our connection and wanted to create a quiet, relaxed moment for us—a chance to step away from the daily rush, sip something warm, and catch up properly.',
      quote: '"Great stories start over simple coffee."',
      iconName: 'coffee'
    },
    {
      id: 4,
      title: 'So, Here Is My Question...',
      subtitle: 'A simple step forward',
      content: 'I would love the opportunity to share a cozy coffee date with you. No rush, no expectations, just good coffee and great company.',
      quote: '"Shall we create a new favorite memory?"',
      iconName: 'star'
    }
  ]
};
