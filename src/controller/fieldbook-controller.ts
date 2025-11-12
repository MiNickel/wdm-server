import { FieldbookService } from "../services/fieldbook.service";
import Controller from "./controller";
import express from "express";
import { ObservedObjectService } from "../services/observed-object.service";

export class FieldbookController extends Controller {
  private fieldbookService = new FieldbookService();
  private observedObjectService = new ObservedObjectService();

  protected initializeRoutes(): void {
    this.router.get("/fieldbookForStation/:id", (req, res) =>
      this.getFieldbookForStation(req, res)
    );
    this.router.get("/fieldbooksForStructure/:id", (req, res) =>
      this.getFieldbooksForStructure(req, res)
    );
  }

  async getFieldbookForStation(req: express.Request, res: express.Response) {
    const response = await this.fieldbookService.getFieldbookForStation(
      req.params.id
    );
    res.json(response).status(200);
  }

  async getFieldbooksForStructure(req: express.Request, res: express.Response) {
    const stations = await this.observedObjectService.getStationsForStructure(
      req.params.id
    );
    const stationIds = stations.map(station => station.id);

    const fieldbooks = await Promise.all(
      stationIds.map(async stationId => {
        return this.fieldbookService.getFieldbookForStation(
          stationId.toString()
        );
      })
    );

    res.json(fieldbooks).status(200);
  }
}
