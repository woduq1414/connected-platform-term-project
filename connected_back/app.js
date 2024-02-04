require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/user');
const videoRoute = require('./routes/video');


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/api/user', userRoute);
app.use('/api/video', videoRoute);


module.exports = app;