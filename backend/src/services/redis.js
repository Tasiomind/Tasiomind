import Redis from "ioredis";
import config from "config/app.config";

const { port, host, clusterMode } = config.redis;
const url = `redis://${host}:${port}`;

const createClient = () => {
  let redisOptions;

  if (config.appName === "production") {
    redisOptions = {
      tls: {
        rejectUnauthorized: false,
      },
    };
  }

  if (clusterMode === "enabled") {
    return new Redis.Cluster(
      [
        {
          port,
          host,
        },
      ],
      {
        redisOptions,
      }
    );
  }

  if (url) {
    return new Redis(url, redisOptions);
  }

  return new Redis({ port, host }, redisOptions);
};

const client = createClient();

// Event listeners for connection check
client.on("connect", () => {
  console.log("Successfully connected to Redis");
});

client.on("error", (err) => {
  console.error("Error connecting to Redis:", err);
});

client.on("ready", () => {
  console.log("Redis client is ready to use");
});

client.on("end", () => {
  console.log("Redis connection closed");
});

// Optional: You can also add a reconnection strategy if needed
client.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

export default client;
