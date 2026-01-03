import { ParamsDictionary, Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ObservedObjectService } from "../services/observed-object.service";
import Controller from "./controller";
import express from "express";
import { ObservedObject } from "../types/observed-object";
import logger from "../util/logger";

export class ObservedObjectController extends Controller {
  private observedObjectService = new ObservedObjectService();

  protected initializeRoutes(): void {
    this.router.get("/allStructures", (req, res) => this.getAllStructures(res));
    this.router.get("/stationsForStructure/:id", (req, res) =>
      this.getStationsForStructure(req, res)
    );
    this.router.post("/observedObjectType", (req, res) =>
      this.createObservedObjectType(req, res)
    );
    this.router.get(
      "/observedObjectTypeByName",
      (req: express.Request, res: express.Response) => {
        this.getObservedObjectTypeByName(req, res);
      }
    );
    this.router.post(
      "/observedObject",
      (req: express.Request, res: express.Response) =>
        this.createObservedObject(req.body as ObservedObject, res)
    );
    this.router.get(
      "/structure/:id",
      (req: express.Request, res: express.Response) =>
        this.getStructure(req.params.id, res)
    );
    this.router.get(
      "/allStationGPSCoordinates",
      (req: express.Request, res: express.Response) =>
        this.getAllStationGPSCoordinates(res)
    );
    this.router.put(
      "/observedObject/:id",
      (req: express.Request, res: express.Response) =>
        this.updateObservedObject(req, res)
    );
    this.router.post(
      "/createNewTeilbauwerk",
      (req: express.Request, res: express.Response) =>
        this.createNewTeilbauwerk(req, res)
    );
    this.router.get("/error", (req, res, next) => {
      try {
        // Force an error
        throw new Error("Something went wrong!");
      } catch (err) {
        // Pass the error to the error-handling middleware
        logger.info("test");
        next(err);
      }
    });
  }

  async createNewTeilbauwerk(req: express.Request, res: express.Response) {
    const station = req.body;
    const response = await this.observedObjectService.createNewTeilbauwerk(
      station
    );
    res.json(response).status(200);
  }

  async updateObservedObject(req: express.Request, res: express.Response) {
    const { id } = req.params;
    const observedObjectValues: Partial<ObservedObject> = req.body;
    const response = await this.observedObjectService.updateObservedObject(
      id,
      observedObjectValues
    );

    res.json(response).status(200);
  }

  async getAllStationGPSCoordinates(res: express.Response) {
    const response =
      await this.observedObjectService.getAllStationGPSCoordinates();
    res.json(response).status(200);
  }

  async getStructure(id: string, res: express.Response) {
    const response = await this.observedObjectService.getStructure(id);
    res.json(response).status(200);
  }

  async createObservedObject(oo: ObservedObject, res: express.Response) {
    const response = await this.observedObjectService.createObservedObject(oo);
    res.json(response).status(200);
  }

  async getObservedObjectTypeByName(
    req: express.Request,
    res: express.Response
  ) {
    const response =
      await this.observedObjectService.getObservedObjectTypeByName(
        req.query.name as string
      );
    res.json(response).status(200);
  }

  async getAllStructures(res: express.Response) {
    const response = await this.observedObjectService.getAllStructures();
    res.json(response);
    res.status(200);
  }

  async getStationsForStructure(req: express.Request, res: express.Response) {
    const response = await this.observedObjectService.getStationsForStructure(
      req.params.id
    );
    res.json(response);
    res.status(200);
  }

  async createObservedObjectType(req: express.Request, res: express.Response) {
    const response = await this.observedObjectService.createObservedObjectType(
      req.body.name
    );
    res.json(response).status(200);
  }
}
