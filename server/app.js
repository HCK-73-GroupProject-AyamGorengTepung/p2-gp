const express = require("express");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to GTC" });
});

const messages = [];

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("/messages/create", ({ text, sender }) => {
        console.log("message from client", { sender, text });

        messages.push({ text, sender, createdAt: new Date() });

        io.emit("messages:broadcast", messages);
    });

    socket.on("disconnect", () => {
        console.log("user disconnect", socket.id);
    });
});

server.listen(3000, () => {
    console.log("running at http://localhost:3001");
});
