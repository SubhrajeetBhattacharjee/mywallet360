import "dotenv/config";
import app from "./app.js";
import { config, validateProductionConfig } from "./config.js";

validateProductionConfig();

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.nodeEnv})`);
});

server.requestTimeout = config.requestTimeoutMs;
server.headersTimeout = config.requestTimeoutMs + 5_000;
server.keepAliveTimeout = 5_000;

function shutdown(signal) {
  console.log(`${signal} received. Closing server.`);

  const forceExit = setTimeout(() => {
    console.error("Graceful shutdown timed out.");
    process.exit(1);
  }, config.shutdownTimeoutMs);
  forceExit.unref();

  server.close((error) => {
    clearTimeout(forceExit);

    if (error) {
      console.error("Server shutdown failed:", error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

