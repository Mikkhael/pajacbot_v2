
const winston = require("winston");

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({stack: true}),
		winston.format.printf(info => {
			return `[${info.timestamp}] ${info.level}: \t${info.stack || info.message}`;
		}),
	),
	transports: [
		new winston.transports.Console()
	]
});

module.exports = logger