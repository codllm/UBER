require("dotenv").config();

const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");
const connectToDb = require("./db/db");
const Captain = require("./models/caption.model");

// ================= DATABASE =================
connectToDb();

const PORT = process.env.PORT || 3060;

const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.set("io", io);


io.on("connection", (socket) => {

  console.log("🔌 New socket connected:", socket.id);


  // REGISTER CAPTAIN (save socketId in DB)

  socket.on("register-captain", async (captainId) => {
    try {
      await Captain.findByIdAndUpdate(captainId, {
        socketId: socket.id,
        status: "active",
      });

      console.log("✅ Captain registered:", captainId);
    } catch (err) {
      console.error("❌ Captain register error:", err.message);
    }
  });



 // user ride create-->rideID generated and when ride accepted by captain then
 //ride room emited to user and captain and both join the room with rideID
  socket.on("join-ride", (rideId) => {
    socket.join(rideId);

  });


  // CAPTAIN LIVE LOCATION UPDATE(event)
  socket.on("captain-location-update", (data) => {


    if (!data?.rideId){
      console.error("❌ Missing rideId in location update that i swhy error comes in console");
      return;
    }

    io.to(data.rideId).emit("captain-location", {
      latitude: data.latitude,
      longitude: data.longitude,
    });
  });

  //otp verification event
  socket.on("otp-verified", (data) => {

    const { rideId } = data;
  
    if (!rideId) return;
  
    io.to(rideId).emit("otp-verified-success", rideId);
  
  });


  // HANDLE DISCONNECT

  socket.on("disconnect", async () => {
    console.log("❌ Socket disconnected:", socket.id);

    try {
      await Captain.findOneAndUpdate(
        { socketId: socket.id },
        { socketId: null, status: "inactive" }
      );
    } catch (err) {
      console.error("❌ Disconnect update error:", err.message);
    }
  });

});

// ================= START SERVER =================
server.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});