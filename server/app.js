const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Country } = require("./models");

const app = express();
const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let countries = [];
let onlineUsers = [];
let rooms = {};

const loadCountries = async () => {
  try {
    countries = await Country.findAll();
    console.log("Countries loaded successfully.");
  } catch (error) {
    console.error("Error loading countries:", error);
  }
};

loadCountries();

app.get("/countries", async (req, res) => {
  try {
    res.status(200).json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getRandomCountry = () => {
  if (countries.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
};

const startTimer = (roomId) => {
  if (rooms[roomId]) {
    rooms[roomId].timer = setTimeout(() => {
      handleTimeout(roomId);
    }, 10000); // 10 seconds
  }
};

const clearTimer = (roomId) => {
  if (rooms[roomId] && rooms[roomId].timer) {
    clearTimeout(rooms[roomId].timer);
    rooms[roomId].timer = null;
  }
};

const handleTimeout = (roomId) => {
  if (rooms[roomId]) {
    const newCountryData = getRandomCountry();
    rooms[roomId].countryData = newCountryData;
    io.to(roomId).emit("timeUp", {
      message: "Time's up!",
      newCountry: newCountryData,
    });
    startTimer(roomId);
  }
};

io.on("connection", (socket) => {
  setTimeout(() => {
    socket.emit("online:users", onlineUsers);
  }, 1000);

  console.log(`A user connected`, socket.id);

  if (socket.handshake.auth.username) {
    onlineUsers.push({
      id: socket.id,
      username: socket.handshake.auth.username,
    });
    socket.broadcast.emit("online:users", onlineUsers);
  }

  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 15);
    rooms[roomId] = {
      players: [socket.id],
      countryData: null,
      correctAnswers: 0,
      scores: {},
      timer: null,
    };
    rooms[roomId].scores[socket.id] = 0;
    socket.join(roomId);
    socket.emit("roomCreated", roomId);
  });

  socket.on("joinRandomRoom", () => {
    const roomIds = Object.keys(rooms);
    if (roomIds.length > 0) {
      const roomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      if (rooms[roomId].players.length < 2) {
        rooms[roomId].players.push(socket.id);
        rooms[roomId].scores[socket.id] = 0;
        socket.join(roomId);
        socket.emit("roomJoined", roomId);

        if (rooms[roomId].players.length === 2) {
          const countryData = getRandomCountry();
          rooms[roomId].countryData = countryData;
          io.to(roomId).emit("startGame", countryData);
          startTimer(roomId);
        }
      } else {
        socket.emit("roomFull");
      }
    } else {
      socket.emit("noRooms");
    }
  });

  socket.on("correctAnswer", (roomId) => {
    if (rooms[roomId]) {
      clearTimer(roomId);
      rooms[roomId].correctAnswers++;
      rooms[roomId].scores[socket.id]++;

      if (rooms[roomId].correctAnswers >= 5) {
        const scores = rooms[roomId].scores;
        const players = rooms[roomId].players;
        const winnerScore = Math.max(...Object.values(scores));
        const winnerId = Object.keys(scores).find(
          (key) => scores[key] === winnerScore
        );

        players.forEach((playerId) => {
          const isWinner = playerId === winnerId;
          io.to(playerId).emit("gameEnded", {
            message: isWinner
              ? "Congratulations! You won!"
              : "Game Over. You lost.",
            won: isWinner,
            score: scores[playerId],
            totalScore: winnerScore,
          });
        });

        delete rooms[roomId];
      } else {
        const newCountryData = getRandomCountry();
        rooms[roomId].countryData = newCountryData;
        io.to(roomId).emit("startGame", newCountryData);
        startTimer(roomId);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`A user disconnected: ${socket.id}`);

    onlineUsers = onlineUsers.filter((item) => item.id !== socket.id);
    socket.broadcast.emit("online:users", onlineUsers);

    for (let roomId in rooms) {
      let index = rooms[roomId].players.indexOf(socket.id);
      if (index > -1) {
        rooms[roomId].players.splice(index, 1);
        clearTimer(roomId);

        if (rooms[roomId].players.length === 0) {
          delete rooms[roomId];
        } else if (rooms[roomId].players.length < 2) {
          io.to(roomId).emit("playerLeft", {
            message:
              "A player has left. The game will be restarted or the room will be reset.",
          });
        }
        break;
      }
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
