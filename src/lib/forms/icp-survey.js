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

    // Q1 (was Q3)
    {
      type: "long_text",
      field: "app_trust",
      number: 1,
      question:
        "If an app made renting or buying a home as easy as booking an Airbnb — what would actually make you trust it?",
      placeholder: "What would need to be true...",
      hint: "Think about what makes you trust or distrust apps you already use.",
      required: true,
    },

    // Q2 (was Q1)
    {
      type: "long_text",
      field: "buying_process",
      number: 2,
      question: "When you want to know if something's worth buying — what's your actual process?",
      placeholder: "Type your answer here...",
      hint: "Could be anything — food, clothes, electronics, whatever.",
      required: true,
    },

    // Q3 (was Q2)
    {
      type: "long_text",
      field: "life_at_30",
      number: 3,
      question: "Picture your life at 30. Where are you, and what does it look like?",
      placeholder: "Paint the picture...",
      hint: "Be as specific or as vague as you want.",
      required: true,
    },

    // Q4 (was Q4)
    {
      type: "long_text",
      field: "typical_day",
      number: 4,
      question:
        "When you're not in school or asleep — what are you actually doing? Walk me through a real Tuesday.",
      placeholder: "3pm, school ends. Then...",
      hint: "The more specific the better. No judgment.",
      required: true,
    },

    // Q5 (was Q6)
    {
      type: "long_text",
      field: "financial_stress",
      number: 5,
      question: "What feels most uncertain or stressful about your financial future?",
      placeholder: "What's weighing on you...",
      hint: "Could be short-term, long-term, or both.",
      required: true,
    },

    // Q6 (was Q7)
    {
      type: "choice_with_text",
      field: "own_vs_rent",
      textField: "own_vs_rent_reason",
      number: 6,
      question: "Gut feeling — would you rather own or rent long-term?",
      subtext: "There's no right answer.",
      choices: [
        { emoji: "🏡", label: "Own", value: "own" },
        { emoji: "🔑", label: "Rent", value: "rent" },
        { emoji: "🤷", label: "No idea yet", value: "unsure" },
      ],
      textPlaceholder: "Tell us why... or why not.",
      textHint: "Optional but we'd love to hear your thinking.",
    },

    // Q7 (was Q5)
    {
      type: "long_text",
      field: "honest_talk",
      number: 7,
      question:
        "What's one thing you wish adults talked to you more honestly about — money, where life goes after school, anything?",
      placeholder: "Be honest...",
      hint: "There's genuinely no wrong answer here.",
      required: true,
    },

    {
      type: "summary_contact",
      heading: "Here's what you shared.",
      subheading: "Want us to save this and keep you in the loop on what we build?",
      namePlaceholder: "First name",
      emailPlaceholder: "Your email",
      submitLabel: "Save my responses →",
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
