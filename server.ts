import { config } from "dotenv";
import express from "express";
import cors from "cors";
config();

class Server {
  private app: express.Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 5009;
  }

  private initilizeRoute() {

  }

  private initilizeMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors())
  }

  public init() {
    this.initilizeMiddleware();
    this.initilizeRoute();

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.init();