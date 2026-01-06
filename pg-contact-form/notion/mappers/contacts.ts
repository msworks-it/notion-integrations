import type { contact_messages } from "../../generated/prisma/client";

export function contactToNotion(contact: contact_messages) {
  return {
    Name: {
      title: [
        {
          text: {
            content: contact.name,
          },
        },
      ],
    },
    Email: {
      email: contact.email,
    },
    Message: {
      rich_text: [
        {
          text: {
            content: contact.message,
          },
        },
      ],
    },
    SubmittedAt: {
      date: {
        start: contact.createdAt.toISOString(),
      },
    },
  };
}