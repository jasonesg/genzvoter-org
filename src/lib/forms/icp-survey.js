// ICP Survey — form config
// Each step drives one full-screen in FormRunner.jsx

export const ICP_SURVEY = {
  slug: "icp-survey",
  title: "ICP Survey",
  steps: [
    {
      type: "welcome",
      heading: "Real talk.",
      subheading:
        "7 questions. No right answers. We just want to understand what's actually going on in your world.",
      cta: "Let's go →",
      eyebrow: "Takes about 3 minutes",
    },

    // Q1 — logo recognition (single-select + fun fact tooltip)
    {
      type: "logo_select",
      field: "logo_recognition",
      number: 1,
      question: "Which of these logos look familiar to you?",
      subtext: "Pick the most familiar one.",
      logos: [
        {
          label: "Airbnb",
          value: "airbnb",
          icon: "/logo-airbnb.png",
          funFact: "Originally \"AirBed & Breakfast\" that was founded in 2008. The company's very first paying guests slept on air mattresses in the Founders' living room.",
        },
        {
          label: "Zillow",
          value: "zillow",
          icon: "/logo-zillow.png",
          funFact: "When their site publicly launched on December 2004, the demands from users to see their \"Zestimates\" instantly crashed the company's servers.",
        },
        {
          label: "Robinhood",
          value: "robinhood",
          icon: "/logo-robinhood.png",
          funFact: "Founded on April 18th, 2013, their promise of commission-free trades generated so much hype that almost a million people joined their waitlist before they publicly launched.",
        },
        {
          label: "Pinterest",
          value: "pinterest",
          icon: "/logo-pinterest.png",
          funFact: "After Pinterest was founded in December 2009, the Founder personally wrote emails to the platform's first 5,000 users to gather feedback, and even occasionally giving out his personal cell phone number.",
        },
      ],
      required: true,
    },

    // Q2 — YouTube channels
    {
      type: "long_text",
      field: "youtube_channels",
      number: 2,
      question: "When you go on YouTube, what are the top three channels that pop up on your homepage?",
      placeholder: "youtube.com/@thedailyshow",
      hint: "Would these be people you'd personally go-to for school/life advice?",
      required: true,
    },

    // Q3 — typical day
    {
      type: "long_text",
      field: "typical_day",
      number: 3,
      question: "When you're not in school, what are you doing on your free-time? Walk me through a random Tuesday.",
      placeholder: "I genuinely enjoy...",
      hint: "Are you in extra-curricular sports? Club? Hacking on something at home? Reading?",
      required: true,
    },

    // Q4 — adult advice
    {
      type: "long_text",
      field: "adult_advice",
      number: 4,
      question: "What's one thing you wish that adults talked to you directly about?",
      placeholder: "tbh..",
      hint: "Advice on day-to-day decisions? Life after school? How to comeback from failures? Money?",
      required: true,
    },

    // Q5 — financial comfort (3 choices, no "Sometimes")
    {
      type: "choice_with_text",
      field: "financial_comfort",
      textField: "financial_comfort_reason",
      number: 5,
      question: "Do you feel comfortable talking to your parents about splurging on something like a laptop or concert tickets?",
      subtext: "No right answer here.",
      choices: [
        { emoji: "✅", label: "Yes, always.",          value: "yes" },
        { emoji: "🙅", label: "Not really",            value: "no" },
        { emoji: "🤐", label: "We never talk money",   value: "never" },
      ],
      textPlaceholder: "What makes it easy or hard to bring up?",
      textHint: "Optional — but we'd love to understand why.",
    },

    // Q6 — own vs rent (3 choices, requires text before continuing)
    {
      type: "choice_with_text",
      field: "own_vs_rent",
      textField: "own_vs_rent_reason",
      number: 6,
      question: "Gut feeling — do you see yourself owning a house at some point?",
      subtext: "There's no right answer.",
      choices: [
        { emoji: "🏡", label: "Definitely",      value: "yes" },
        { emoji: "🤷", label: "Maybe someday",   value: "maybe" },
        { emoji: "🔑", label: "I'd rather rent", value: "rent" },
      ],
      textPlaceholder: "In at least a few words, how come?",
      requireText: true,
      minWords: 10,
    },

    // Q7 — financial stress
    {
      type: "long_text",
      field: "financial_stress",
      number: 7,
      question: "What feels most uncertain about our generation's financial future?",
      placeholder: "The floor is yours.",
      hint: "Could be short-term, long-term, or both.",
      required: true,
    },

    {
      type: "summary_contact",
      heading: "Here's what you shared.",
      subheading: "Want us to save this and keep you in the loop on what we build?",
      namePlaceholder: "Your name",
      emailPlaceholder: "Your email",
      submitLabel: "Share →",
    },

    {
      type: "thankyou",
      heading: "You're the reason we build.",
      subheading:
        "Seriously — this kind of honesty shapes everything. We'll reach out when we have something worth showing you.",
      emoji: "🏠",
    },
  ],
};
