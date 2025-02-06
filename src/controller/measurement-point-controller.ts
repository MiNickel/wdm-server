import { MeasurementPointService } from "../services/measurement-point.service";
import Controller from "./controller";
import express from "express";

export class MeasurementPointController extends Controller {
  private measurementPointService = new MeasurementPointService();

  protected initializeRoutes(): void {
    this.router.put(
      "/measurementPoint/:id",
      (req: express.Request, res: express.Response) => {
        this.updateMeasurementPointWallThickness(req, res);
      }
    );

    this.router.put("/")
  }

  async updateMeasurementPointWallThickness(
    req: express.Request,
    res: express.Response
  ) {
    const response =
      await this.measurementPointService.updateMeasurementPointWallThickness(
        req.params.id,
        req.body.wallThickness
      );

    res.json(response).status(200);
  }
}
