const app = require('./app.js')
const { PORT } = require('./utils/config.js')
const { info } =  require('./utils/logger.js')

app.listen(PORT,() => {
  console.clear()
  info('Listening on ',PORT)
})
