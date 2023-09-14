const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute=require('./router/auth')
const postRoute=require('./router/post')
const userRoute=require('./router/user')
const commentRoute=require('./router/comment')
const convoRoute=require("./router/conversation")
const messageRoute=require("./router/message")
const notificationRoute=require("./router/notification")
const cors=require('cors')





const app = express();

dotenv.config();

//to connect mongosdb
mongoose.connect(process.env.MONGO_URL)
  .then(function(){
    console.log("Database successfully connected");
  })
  .catch(function(err){
    console.log(err);
  });



//middlewares
app.use(express.json());
app.use(helmet());
app.use(cors())
app.use(morgan("common"));

//route 
app.use(authRoute)
app.use(postRoute)
app.use(userRoute)
app.use(commentRoute)
app.use(convoRoute)
app.use(messageRoute)
app.use(notificationRoute)


app.listen(5500, function() {
  console.log("Successfully connected");
});


//----web-socket----
const io = require("socket.io")(6005, {
  cors: {
    origin: "http://localhost:3000",
  },
});


let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};



io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    console.log(users)
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);

    if(user){
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("typing-started",({ senderId, receiverId })=>{
     
      const user = getUser(receiverId);
      if(user){
       
          io.to(user.socketId).emit("typing-started-from-server")
      }
      
  })

  socket.on("typing-stoped",({ senderId, receiverId })=>{
      const user = getUser(receiverId);
      if(user){
          io.to(user.socketId).emit("typing-stoped-from-server")
      }
      
  })

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});  
