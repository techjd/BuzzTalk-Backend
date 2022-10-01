import express, { json, urlencoded } from 'express';
import connectDB from './config/db.js';
import { SUCCESS } from './utils/constants.js';
import http from 'http'
import { config } from "dotenv"
const app = express();
const httpServer = http.createServer(app);
import { Server } from 'socket.io';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
const io = new Server(httpServer);

config()


// Init MiddleWare
app.use(json());
app.use(urlencoded({ extended: true }));


//Connect Database
connectDB();

io.on('connection', (socket) => {
  console.log(socket.id);
  app.set('socket', socket);
});

app.use((req, res, next) => {
  req.io = io;
  return next();
});

// Define Routes

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)
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