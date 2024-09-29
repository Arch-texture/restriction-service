const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const http = require("http");

const restrictionRoutes = require("../routes/restrictions");

const errorHandler = require("../middleware/errorHandler");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.server = http.createServer(this.app);

    this.paths = {
      restrictions: "/api/restrictions",
    };

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(logger("dev"));
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(compression());
  }

  routes() {
    this.app.use(this.paths.restrictions, restrictionRoutes);
    this.app.use(errorHandler);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`Restriction service is running on port ${this.port}`);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      this.server.close(() => {
        console.log("HTTP server closed");
      });
    });
  }
}

module.exports = Server;
