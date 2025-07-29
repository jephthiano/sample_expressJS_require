const express = require("express");
const v1RouteEntry = require('@route/v1/index.rou'); // Route entry point

const app = express();

// Apply middlewares
require('@config/applyMiddleware')(app);

// Register routes
app.use('/api/v1', v1RouteEntry);

module.exports = app;