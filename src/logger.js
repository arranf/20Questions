const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: getLogLevel(),
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ],
});

function getLogLevel() {
  const nodeEnv = process.env.NODE_ENV;
  if (process.env.NODE_ENV === 'production') {
    return 'warn';
  } else if (nodeEnv === 'development') {
    return 'debug';
  } else {
    return 'info';
  }
}

module.exports = logger;