import { FieldbookService } from "../services/fieldbook.service";
import Controller from "./controller";
import express from "express";
import { ObservedObjectService } from "../services/observed-object.service";

export class FieldbookController extends Controller {
  private fieldbookService = new FieldbookService();
  private observedObjectService = new ObservedObjectService();

  protected initializeRoutes(): void {
    /**
     * @swagger
     * /fieldbookForStation/{id}:
     *   get:
     *     summary: Retrieve a fieldbook for a station
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Fieldbook for the station
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Fieldbook'
     */
    this.router.get("/fieldbookForStation/:id", (req, res) =>
      this.getFieldbookForStation(req, res)
    );
    /**
     * @swagger
     * /fieldbooksForStructure/{id}:
     *   get:
     *     summary: Retrieve fieldbooks for a structure
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Fieldbooks for the structure
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Fieldbook'
     */
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
