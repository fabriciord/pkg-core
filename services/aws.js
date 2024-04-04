/**
 * Helper function to communicate with AWS services.
 *
 * @param {string} serviceName The name of the AWS service to use:
 * - SSM
 * - S3
 * - SQS
 * - SNS
 * - DynamoDB
 * - Lambda
 * - Firehose
 * - SES
 * - SESv2
 * - SFN
 * - Rekognition
 * @param {object} options.config The configuration object to use with the AWS service.
 * @param {string} options.config.region The AWS region to use.
 */
const AWS = ({
  serviceName,
  config,
}) => {
  let serviceModule = {};

  try {
    serviceModule = require(`@aws-sdk/client-${serviceName.toLowerCase()}`);
  } catch (err) {
    throw new Error(`Service ${serviceName} not implemented!`);
  }

  const client = new serviceModule[`${serviceName}Client`](config);

  const sendCommand = async ({
    command,
    params,
  }) => {
    const commandName = `${command}Command`;

    if (!serviceModule[commandName]) {
      throw new Error(`Command ${commandName} not found for service ${serviceName}!`);
    }

    return client.send(new serviceModule[commandName](params));
  };

  return {
    sendCommand,
  }
}

module.exports = AWS;
