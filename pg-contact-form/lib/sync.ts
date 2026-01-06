import type { contact_messages } from "../generated/prisma/client";
import { notion } from "./notion";
import { prisma } from "./prisma";

export const MIN_LAST_SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Synchronizes contacts from PostgreSQL to another system (likely Notion).
 * 
 * This function performs the following operations:
 * 1. Checks if a sync was recently performed (within MIN_LAST_SYNC_INTERVAL_MS)
 * 2. If too recent, skips the sync and returns early
 * 3. Otherwise, fetches contacts from PostgreSQL
 * 4. Creates records for each contact in parallel
 * 5. Updates the last sync timestamp
 * 
 * @returns A promise that resolves to an object indicating:
 *   - `skipped: true` if the sync was skipped due to recent sync
 *   - `skipped: false, syncedCount: number` if the sync completed successfully
 * 
 * @throws May throw errors from database operations or record creation failures
 * 
 * @example
 * ```typescript
 * const result = await sync();
 * if (result.skipped) {
 *   console.log('Sync skipped - too soon since last sync');
 * } else {
 *   console.log(`Synced ${result.syncedCount} contacts`);
 * }
 * ```
 */
export async function sync(): Promise<
  | { skipped: true }
  | { skipped: false; syncedCount: number }
> {
  const lastSync = (await lastSyncTime())?.last_synced_at;
  if(lastSync && lastSync > new Date(Date.now() - MIN_LAST_SYNC_INTERVAL_MS)) {
    return { skipped: true };
  }

  const contacts = await getContactsFromPSQL();

  const createPromises = contacts.map(createRecord);
  await Promise.allSettled(createPromises);

  updateLastSyncTime();

  return { skipped: false, syncedCount: contacts.length };
}

/**
 * Retrieves the most recent synchronization record from the database.
 * 
 * @example
 * ```typescript
 * const lastSync = await lastSyncTime();
 * if (lastSync) {
 *   console.log(`Last synced at: ${lastSync.last_synced_at}`);
 * }
 * ```
 */
export async function lastSyncTime(): Promise<null | { last_synced_at: Date }> {
  return await prisma.notion_syncs.findFirst({
    orderBy: {
      last_synced_at: "desc",
    },
  });
}

async function updateLastSyncTime() {
  const now = new Date();
  await prisma.notion_syncs.create({
    data: {
      last_synced_at: now,
    },
  });
  return now;
}

async function createRecord(item: contact_messages) {
  await notion.pages.create({
    parent: {
      database_id: process.env.DATABASE_ID!,
    },
    properties: {
      full_name: {
        title: [
          {
            text: {
              content: item.name,
            },
          },
        ],
      },
      email: {
        email: item.email,
      },
      message: {
        rich_text: [
          {
            text: {
              content: item.message,
            },
          },
        ],
      },
      created_at: {
        date: {
          start: item.createdAt.toISOString(),
        },
      },
    },
  });
}

async function getContactsFromPSQL() {
  return await prisma.contact_messages.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}