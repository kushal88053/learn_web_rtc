const { Server } = require("socket.io");

// Initialize a new Socket.IO server on port 8080
const io = new Server(8080, {
  cors: {
    origin: "*", // Enable CORS for all origins, adjust this in production
    methods: ["GET", "POST"],
  },
});

// Maps to store socket IDs and emails
const socketIdToEmailMap = new Map();
const emailToSocketIdMap = new Map();

let userCount = 1;

io.on("connection", (socket) => {
  console.log(`Socket connected with ID: ${socket.id}`);

  // Listen for a user joining a room
  socket.on("room:join", (data) => {
    const { email, room } = data;
    console.log("User joined count:", userCount++);
    console.log(`Room join data received: ${JSON.stringify(data)}`);

    // Map the socket ID to the user's email and vice versa
    socketIdToEmailMap.set(socket.id, email);
    emailToSocketIdMap.set(email, socket.id);

    // Notify other users in the room about the new user
    io.to(room).emit("user:joined", { email, id: socket.id });

    // Notify the joining user about the room join success
    socket.emit("room:join", { email, room });

    // Add the socket to the specified room
    socket.join(room);
  });

  // Listen for a user making a call
  socket.on("user:call", ({ to, offer }) => {
    console.log("Call received from:", socket.id, "to:", to);
    io.to(to).emit("incoming:call", { from: socket.id, offer });
  });

  // Listen for a call being accepted
  socket.on("call:accepted", ({ to, answer }) => {
    console.log("Call accepted by:", socket.id);
    io.to(to).emit("call:accepted", { from: socket.id, answer });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket with ID ${socket.id} disconnected`);

    // Clean up the mappings to ensure they don't grow unnecessarily
    const email = socketIdToEmailMap.get(socket.id);
    if (email) {
      socketIdToEmailMap.delete(socket.id);
      emailToSocketIdMap.delete(email);
    }
  });
});

console.log("Socket.IO server is running on port 8080");
