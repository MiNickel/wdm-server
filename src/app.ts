import express from "express";
import logger from "./util/logger";
import Controller from "./controller/controller";
import bodyParser from "body-parser";
import cors from "cors";

const corsOptions = {
  origin: process.env.CLIENT_URI,
  optionsSuccessStatus: 200,
};

class App {
  public app: express.Application;
  public port = process.env.PORT || 3001;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddleware();
    this.initializeControllers(controllers);
  }

  private initializeMiddleware = () => {
    this.app.use(bodyParser.json());
    this.app.use(cors(corsOptions));
  };

  private initializeControllers = (controllers: Controller[]) => {
    controllers.forEach(controller => {
      this.app.use("/", controller.router);
    });
  };

  public listen = (): void => {
    this.app.listen(this.port, () => {
      logger.info(`Server started on port ${this.port}!`);
    });
  };
}

export default App;
