import bunyan from "bunyan";
import config from "config/app.config";

const log = bunyan.createLogger({ name: config.appName });

export default log;
