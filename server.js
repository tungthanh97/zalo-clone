const express = require('express');
const connectDB = require('./config/db');
const { handleError } = require('./modules/exception');
const useCors = require('cors');
const routes = require('./modules');
const app = express();
const socketio = require('socket.io');
const socket = require('./config/socket');
const http = require('http');
const useragent = require('express-useragent');
//Connect Database
connectDB();
//Init Middleware
app.use(useCors());
app.use(express.json({ extended: false }));
app.use(useragent.express());

const server = http.createServer(app);
const io = socketio(server);
socket(io);
routes(app);

app.use(handleError);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));