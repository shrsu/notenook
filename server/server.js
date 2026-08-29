require("dotenv").config();
require("./src/auth/LocalStrategy");
require("./src/auth/JwtStrategy");
require("./src/auth/GoogleOAuth");

const express = require("express");
const http = require("http");
const path = require("path");

const { initializeSocketIO } = require("./src/socketHandlers/socketConfig");
const { connectDB } = require("./src/connection/dbConnection");
const {
  createApolloServer,
  startApolloServer,
} = require("./src/graphql/ApolloServer");
const { setupCronJobs } = require("./src/utils/cronJobs");
const { setupMiddlewares } = require("./src/middlewares/setupMiddlewares");
const { setupRoutes } = require("./src/routes/setupRoutes");
const { setupSockets } = require("./src/socketHandlers/setupSockets");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Setup view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Setup middlewares
setupMiddlewares(app);

// Setup routes
setupRoutes(app);

// Setup sockets
const io = initializeSocketIO(server);
setupSockets(io);

// Start Apollo server
const apolloServer = createApolloServer(server);
startApolloServer(apolloServer, app, port);

// Start server
server.listen(port, () => {
  console.log(`App listening at port: ${port}`);
});

// Schedule cron jobs
setupCronJobs();
