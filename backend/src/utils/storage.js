import retry from "retry";
import log from "~utils/logger";
import config from "config/app.config";

const remove = (options) => {
  const { key: Key, bucket: Bucket } = options || {};
  if (config.appStatus === "test") {
    return;
  }
  if (!(Key && Bucket)) {
    return;
  }

  const operation = retry.operation({
    retries: 3,
  });

  operation.attempt((attempt) => {
    // s3.deleteObject({ Key, Bucket }, (err) => {
    //   if (operation.retry(err)) {
    //     log.info(
    //       {
    //         attempt,
    //         Key,
    //         err,
    //       },
    //       "Retry"
    //     );
    //   }
    // });
  });
};

const storage = {
  remove,
};

export default storage;
