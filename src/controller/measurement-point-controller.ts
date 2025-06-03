import { MeasurementPointService } from "../services/measurement-point.service";
import Controller from "./controller";
import express from "express";

export class MeasurementPointController extends Controller {
  private measurementPointService = new MeasurementPointService();

  protected initializeRoutes(): void {
    this.router.post(
      "/structure/:structureId/actualWallthickness",
      (req: express.Request, res: express.Response) => {
        this.updateMeasurementPointWallThickness(req, res);
      }
    );
  }

  async updateMeasurementPointWallThickness(
    req: express.Request,
    res: express.Response
  ) {
    console.log(req.params, req.body);
    const response =
      await this.measurementPointService.updateMeasurementPointWallThickness(
        req.params.structureId,
        req.body.actualWallthickness,
        req.body.sections
      );

    res.json(response).status(200);
  }
}
