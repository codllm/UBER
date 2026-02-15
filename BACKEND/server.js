require("dotenv").config();

const http = require("http");
const app = require("./app");

const { Server } = require("socket.io");
const connectToDb = require("./db/db");

connectToDb();

const port = process.env.PORT || 3060;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {

  console.log("A user connected:", socket.id);

  // ✅ JOIN MUST BE INSIDE HERE
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined room ${userId}`);
  });

  // ✅ DISCONNECT MUST ALSO BE INSIDE
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });

});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
