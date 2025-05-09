const fs = require("fs");
const path = require("path");

const restart = (req, res) => {
  const flagPath = path.resolve(__dirname, "../../restart.flag");
  fs.writeFileSync(flagPath, `Reiniciado em: ${new Date().toISOString()}`);
  console.log("API será reiniciada...");
  res.send("Reiniciando...");
  process.exit(0);
};

module.exports = {
  restart,
};
