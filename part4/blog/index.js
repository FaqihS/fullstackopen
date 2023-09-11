const app = require("./app.js");
const { PORT } = require("./utils/config.js");
const { info } =  require("./utils/logger.js");

app.listen(PORT,()=>{
  info('Listening on ',PORT)
})
