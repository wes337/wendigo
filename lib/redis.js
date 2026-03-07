import { createClient } from "redis";

export default class Redis {
  static client = createClient({
    url: process.env.REDIS_URL,
    pingInterval: 4 * 60 * 1000,
  });

  static publisher = Redis.client.duplicate();
  static subscriber = Redis.client.duplicate();

  static {
    Redis.addErrorHandlers();
  }

  static async connect() {
    await Promise.all([
      Redis.client.connect(),
      Redis.publisher.connect(),
      Redis.subscriber.connect(),
    ]);
  }

  static addErrorHandlers() {
    Redis.client.on("error", (error) => {
      console.log("Redis error:", error?.message ?? error);
    });

    Redis.publisher.on("error", (error) => {
      console.log("Redis pub error:", error?.message ?? error);
    });

    Redis.subscriber.on("error", (error) => {
      console.log("Redis sub error:", error?.message ?? error);
    });
  }
}
