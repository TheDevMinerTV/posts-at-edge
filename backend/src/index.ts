import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;

  DB: D1Database;
}

const CreatePostSchema = z.object({
  username: z.string(),
  content: z.string(),
});

const appendCORSHeaders = (response: Response) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return appendCORSHeaders(new Response());
    } else if (request.method === "POST") {
      const body = CreatePostSchema.parse(await request.json());

      await env.DB.prepare(
        "INSERT INTO posts (id, username, content, timestamp) VALUES (?, ?, ?, ?)"
      )
        .bind(uuidV4(), body.username, body.content, Date.now())
        .run();

      return appendCORSHeaders(new Response("OK"));
    } else if (request.method === "GET") {
      const posts = await env.DB.prepare("SELECT * FROM posts").all();

      return appendCORSHeaders(
        new Response(JSON.stringify(posts), {
          headers: {
            "content-type": "application/json; charset=UTF-8",
          },
        })
      );
    }

    return appendCORSHeaders(
      new Response("Method not allowed", { status: 405 })
    );
  },
};
