const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { corsOrigin } = require('./config');
const { registerRoutes } = require('./routes');

const app = express();

app.use(cors({ credentials: true, origin: corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

registerRoutes(app);

module.exports = app;
