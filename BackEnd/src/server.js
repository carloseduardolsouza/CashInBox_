//rodar o servidor
const app = require("./app");

require('dotenv').config();
require('./models/initDB');

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Aplicação rodando em localhoost:${PORT}`);
});