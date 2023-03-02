import express, { json, urlencoded } from 'express';
import morgan from "morgan"
import connectDB from './config/db.js';
import { SUCCESS } from './utils/constants.js';
import http from 'http'
import { config } from "dotenv"
const app = express();
const httpServer = http.createServer(app);
import { Server } from 'socket.io';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import postRouter from './routes/postRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import universityRouter from './routes/universityRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import orgRouter from './routes/organizationRoutes.js';
const io = new Server(httpServer);

config()


// Init MiddleWare
app.use(json());
app.use(urlencoded({ extended: true }));

//Connect Database
connectDB();

app.use(morgan('combined'))

io.on('connection', (socket) => {
  console.log(socket.id);
  app.use((req, res, next) => {
    req.socket = socket
    next()
  })
  // // convenience function to log server messages on the client
  // function log() {
  //   var array = ['Message from server:'];
  //   array.push.apply(array, arguments);

  //   // Pass the conversation Id over here
  //   io.in('foo').emit('log', array)
  //   // socket.emit('log', array); Old Socket Code
  // }

  socket.on('message', function (message) {
    // log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.to(message.conversationId).emit('message', message)
    // socket.broadcast.emit('message', message); Old Socket Code 
  });

  socket.on('create or join', function (room) {
    // Clients in Room
    let clientsInRoom = io.sockets.adapter.rooms.get(room)

    // We will get a conversationId in room

    console.log('Received request to create or join room ' + room);
    // console.log(clientsInRoom);

    var numClients = clientsInRoom ? clientsInRoom.size : 0;

    // log('Room ' + room + ' now has ' + numClients + ' client(s)');
    console.log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      // Pass conversation id over here
      socket.join(room);
      // log('Client ID ' + socket.id + ' created room ' + room);
      io.in(room).emit('created', room, socket.id)
      // socket.emit('created', room, socket.id);

    } else if (numClients === 1) {

      // log('Client ID ' + socket.id + ' joined room ' + room);
      io.in(room).emit('join', room);
      socket.join(room);
      
      io.in(room).emit('joined', room, socket.id)

      // socket.emit('joined', room, socket.id);
      io.in(room).emit('ready');

    } else {
      // max two clients
      console.log("Room Fukk")
      socket.emit('full', room);
    }
  });

  socket.on('bye', function (msg) {
    console.log("Received Bye", msg)
    // Here we are getting conversationId in msg
    socket.to(msg).emit('out', "Bye Bye Bye")
    // io.in(msg).socketsLeave(msg);
    socket.leave(msg)
    // socket.broadcast.emit('out', msg); Old Socket Code
    console.log('received bye' + msg);
    // console.log('clients in room', io.sockets.adapter.rooms.get(msg).size)
  });

  socket.on("bye1", (msg) => {
    socket.leave(msg)
  })

});

app.use((req, res, next) => {
  req.io = io;
  req.app = app
  return next();
});

// Define Routes

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/post', postRouter);
app.use('/api/company', companyRouter);
app.use('/api/university', universityRouter)
app.use('/api/testImage', imageRouter)
app.use('/api/org', orgRouter)
// app.use('/api/auth', require('./routes/api/auth'));
// app.use('/api/posts', require('./routes/api/posts'));
// app.use('/api/profile', require('./routes/api/profile'));
// app.use('/api/chat', require('./routes/api/chat'));
// app.use('/api/jobs', require('./routes/api/jobs'));
// app.use('/api/notifications', require('./routes/api/notifications'));

const PORT = process.env.PORT || 5500;

app.get('/api/checkStatus', (req, res) => {
  console.log('Req');
  res.send({ msg: "API Working" });
});

httpServer.listen(PORT, () =>  {
  console.log(SUCCESS)
  console.log(`Server started on PORT ${PORT}`)
});