require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const helmet = require("helmet");
const path = require("path")
const routes = require("./routes");
const config = require("./config");
const dbconnect = require("./config/dbconnect");
const rescheduler = require("./utility/eventRescheduler");

const app = express();

// app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cors());

app.set("view engine", "ejs");

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

routes(app);

dbconnect();

app.use(express.static(path.resolve(__dirname, "../../new_client/build")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../new_client/build/index.html"));
});

let port = config.port;
if (process.env.NODE_ENV === "test") port = 8001;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  rescheduler.reschedule();
});

module.exports = app;
