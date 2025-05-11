export const TEST_DATA_TEMPLATES = {
  feedback: {
    data: {
      rating: 5,
      feedback: "Test feedback message",
      email: "test@example.com"
    }
  },
  contact: {
    data: {
      name: "Test User",
      email: "test@example.com",
      message: "Test contact message"
    }
  },
  waitlist: {
    data: {
      name: "Test User",
      email: "test@example.com",
      referralSource: "Test Campaign"
    }
  }
} as const;

export type FormType = keyof typeof TEST_DATA_TEMPLATES; 