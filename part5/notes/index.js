const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT,() => {
  logger.info(`Running on ${config.PORT}`)

})
