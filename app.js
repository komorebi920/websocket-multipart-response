const Websocket = require("ws");
const Koa = require("koa");
const fs = require("fs");
const static = require("koa-static");

const app = new Koa();
const socket = new Websocket.Server({ port: 3030 });

app.use(static(__dirname + "/public"));

socket.on("connection", handleConnection);

function handleConnection(ws) {
  ws.on("close", handleClose);
  ws.on("error", handleError);
  ws.on("message", handleMessage);
}

function handleClose() {
  console.log("--- Server is closed ---");
  this.send(JSON.stringify({ mode: "CLOSE", msg: "--- Server is closed ---" }));
}

function handleError(error) {
  console.log("--- Server occured error ---", error);
}

function handleMessage(filename) {
  const dataPath = `${__dirname}/${filename}`;
  const dataBuffer = fs.readFileSync(dataPath);

  this.send(dataBuffer);
}

// 启动服务器
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
