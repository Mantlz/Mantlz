"use server"

import { headers } from "next/headers"
import { DatabaseSyncResponse } from "@/types/users/user"

export async function getDatabaseSyncStatus(): Promise<DatabaseSyncResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const response = await fetch(`${baseUrl}/api/auth/getDatabaseSyncStatus`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to sync user: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("Database sync error:", error)
    throw new Error("Failed to sync user with database")
  }
}
