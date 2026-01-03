import express from "express";
import logger from "./util/logger";
import Controller from "./controller/controller";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

    // Swagger setup
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "My API",
          version: "1.0.0",
          description: "API documentation",
        },
        servers: [
          {
            url: "http://localhost:3001",
          },
        ],
        components: {
          schemas: {
            Waterlevels: {
              type: "object",
              properties: {
                MThw: { type: "number" },
                MTnw: { type: "number" },
              },
            },
            Riverbed: {
              type: "object",
              properties: {
                planRiverbed: { type: "number" },
                currentRiverbed: { type: "number" },
              },
            },
            Profil: {
              type: "object",
              properties: {
                name: { type: "string" },
                picture: { type: "string" },
              },
            },
            MeasurementRow: {
              type: "object",
              properties: {
                height: { type: "string" },
                section: { type: "string" },
                remainingWallThickness: {
                  type: "array",
                  items: { type: "number" },
                },
                wallThickness: { type: "number" },
                distanceLockedge: { type: "number" },
                troughDepth: { type: "array", items: { type: "number" } },
                quality: { type: "string" },
                remarks: { type: "string" },
              },
            },
            Fieldbook: {
              type: "object",
              properties: {
                structure: { type: "string" },
                station: { type: "string" },
                block: { type: "string" },
                date: { type: "string", format: "date" },
                diver: { type: "string" },
                protocolLeader: { type: "string" },
                constructionYear: { type: "number" },
                age: { type: "number" },
                waterlevels: { $ref: "#/components/schemas/Waterlevels" },
                riverbed: { $ref: "#/components/schemas/Riverbed" },
                measurements: {
                  type: "array",
                  items: { $ref: "#/components/schemas/MeasurementRow" },
                },
                profil: { $ref: "#/components/schemas/Profil" },
              },
            },
          },
        },
      },
      apis: ["./src/controller/**/*.ts"], // files containing annotations as above
    };

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
