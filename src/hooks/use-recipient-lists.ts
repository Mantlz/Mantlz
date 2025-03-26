import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";

export interface RecipientList {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    recipients: number;
  };
}

export function useRecipientLists() {
  const { data: lists, isLoading } = useQuery({
    queryKey: ["recipient-lists"],
    queryFn: async () => {
      try {
        const response = await client.recipient.getLists.$get();
        return response.json() as Promise<RecipientList[]>;
      } catch (err) {
        console.error("Error fetching recipient lists:", err);
        throw err;
      }
    },
  });

  return {
    lists,
    isLoading,
  };
} 