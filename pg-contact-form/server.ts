import { sync } from "./lib/sync";

const server = Bun.serve({
  port: 6969,
  routes: {
    "/sync": {
      GET: async (req) => {
        try {
          const result = await sync();
          if(result.skipped)
            return new Response("Sync skipped - too soon since last sync", { status: 200 });
          return new Response(`Synced ${result.syncedCount} contacts`, { status: 200 });
        } catch (error) {
          return new Response(`Error: ${(error as Error).message}`, { status: 500 });
        }
      }
    }
  },

  async fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on ${server.url}`);