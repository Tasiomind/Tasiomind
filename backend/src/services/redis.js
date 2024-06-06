import Redis from 'ioredis';
import config from 'config/app.config';

const { port, host, clusterMode } = config.redis;
const url = `redis://${host}:${port}`;

const createClient = redisConfig => {
  try {
    const client = clusterMode ? new Redis.Cluster([{ port, host }], redisConfig) : new Redis(url);

    // Event listeners for connection status
    client.on('connect', () => console.log('Connected to Redis server at', url));
    client.on('error', err => console.error('Error connecting to Redis:', err));
    client.on('ready', () => console.log(`Redis client is ready`));
    client.on('end', () => console.log('Redis connection closed'));

    // Reconnect logic: Attempt reconnection if connection is lost
    client.on('close', () => {
      console.log('Connection to Redis lost. Attempting to reconnect...');
      client.connect();
    });

    return client;
  } catch (error) {
    console.error('Error creating Redis client:', error);
    throw error;
  }
};

export default createClient({
  retryStrategy: times => Math.min(times * 50, 2000), // Exponential backoff for retries
  connectTimeout: 10000, // Timeout for connection attempts (in milliseconds)
  maxRetriesPerRequest: 3, // Maximum number of retries for each request
  enableOfflineQueue: true, // Enable the offline command queue to store commands executed while the connection is lost
  enableReadyCheck: true, // Enable the "ready check" to verify whether the server is ready to accept commands
  enableAutoPipelining: true, // Enable automatic pipelining of commands to reduce round-trip time
  enableTLSForCommand: true, // Enable TLS encryption for Redis commands
  autoResubscribe: true, // Automatically resubscribe to Pub/Sub channels upon reconnection
});
