import express from "express";
import logger from "./util/logger";
import Controller from "./controller/controller";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../swagger";

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
    this.initializeSwagger();
    this.app.use(
      (
        err: any,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        logger.error(`Error occurred: ${err.message}`);
        res.status(500).send("Something went wrong!!!!");
      }
    );
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

  private initializeSwagger = () => {
    const swaggerDocs = swaggerJSDoc(swaggerOptions);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  };

  public listen = (): void => {
    this.app.listen(this.port, () => {
      logger.info(`Server started on port ${this.port}!`);
    });
  };
}

export default App;
