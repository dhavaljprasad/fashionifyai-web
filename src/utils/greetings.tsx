const GreetingsData = [
  {
    line: "What's the look today",
    end: "?",
  },
  {
    line: "Ready for your next look",
    end: "?",
  },
  {
    line: "What are we dressing for today",
    end: "?",
  },
  {
    line: "Let's find your perfect outfit",
    end: ".",
  },
  {
    line: "What vibe are we going for",
    end: "?",
  },
  {
    line: "Time to style something special",
    end: ".",
  },
  {
    line: "Let's make it look effortless",
    end: ".",
  },
  {
    line: "What's inspiring your style",
    end: "?",
  },
  {
    line: "Your next favorite outfit starts here",
    end: ".",
  },
  {
    line: "Let's create a look that's uniquely yours",
    end: ".",
  },
];

export const getRandomGreeting = () => {
  return GreetingsData[Math.floor(Math.random() * GreetingsData.length)];
};
