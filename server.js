const express = require('express');
const connectDB = require('./config/db');
const { handleError } = require('./exception');
const routes = require('./modules');
const app = express();

//Connect Database
connectDB();

//Init Middleware

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Runing'));

routes(app);

app.use(handleError);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
