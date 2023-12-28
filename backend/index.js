const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

// Socket implementation
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("chatMessage", (inputText) => {
    io.emit("chatMessage", inputText);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send({ message: "Server running" });
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
