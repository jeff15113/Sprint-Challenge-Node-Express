const express = require("express"); // importing a CommonJS module

const ActionRouter = require("./routes/action-router");

const ProjectRouter = require("./routes/project-router");

const server = express();

server.use(express.json());

server.use("/api/action", ActionRouter);
server.use("/api/project", ProjectRouter);

var port = process.env.PORT || 4000;

server.get("/", async (req, res) => {
  res.send(`
    <h2>Project Tracker API</h>
    <p>Welcome!!!! :D </p>
  `);
});

server.listen(port, () => {
  console.log(`\n* Server Running on http://localhost:${port} *\n`);
});
