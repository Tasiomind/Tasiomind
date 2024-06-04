import Analytics from "analytics-node";
import config from "config/app.config";

const analytics = new Analytics(config.segmentWriteKey, {
  enable: config.appStatus !== "test",
  flushAt: config.appStatus === "production" ? 20 : 1,
});

export default analytics;
