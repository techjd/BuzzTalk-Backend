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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect Database
connectDB();

app.use(morgan('combined'))

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('grp', (data) => {
    console.log(data)
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