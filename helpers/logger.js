/* eslint-disable no-undef */
const pino = require('pino');
const pinoExpress = require('express-pino-logger');

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL;
  }

  serverLogger() {
    pino(
      {
        name: 'server',
        level: this.level,
        formatters: {
          level(label) {
            return { level: label };
          }
        }
      },
      pino.destination(`./logs/server-${process.env.NODE_ENV}`)
    );
  }

  expressLogger() {
    pinoExpress(
      {
        name: 'express',
        level: this.level,
        formatters: {
          level(label) {
            return { level: label };
          }
        }
      },
      pino.destination(`./logs/express-${process.env.NODE_ENV}`)
    );
  }
}

module.exports = new Logger();
