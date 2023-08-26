const http = require("http").createServer();
const {instrument} = require("@socket.io/admin-ui");

const io = require("socket.io")(http, {
  cors: { origin: ["http://localhost:3000","https://admin.socket.io"],
  credentials: true    },
});

const connectedUsers = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (user) => {
    console.log("User joined", user);
    connectedUsers.push({ ...user, socketId: socket.id });
    console.log(connectedUsers);
    io.emit("users", connectedUsers);
  });

  socket.on("send_message", (msg) => {
    console.log("Message received:", msg);
    const targetUser = connectedUsers.find((user) => user.username === msg.to);
    if (targetUser) {
      console.log("Sending message to", targetUser.username , targetUser.socketId);
      io.to(targetUser.socketId).emit("message", msg);
    }
  });


  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const userIndex = connectedUsers.findIndex(
      (user) => user.socketId === socket.id
    );
    if (userIndex !== -1) {
      connectedUsers.splice(userIndex, 1); // Remove user from the connectedUsers array
    }
    io.emit("users", connectedUsers);
  });
});

instrument(io, {
  auth: false,
});

http.listen(4000, () => {
  console.log("listening on *:4000");
});
