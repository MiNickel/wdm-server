import { ObservedObjectService } from "../services/observed-object.service";
import Controller from "./controller";
import express from "express";
import { ObservedObject } from "../types/observed-object";

export class ObservedObjectController extends Controller {
  private observedObjectService = new ObservedObjectService();

  protected initializeRoutes(): void {
    /**
     * @openapi
     * /allStructures:
     *   get:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Gibt alle Bauwerke und Teilbauwerke zurück
     *     responses:
     *       200:
     *         description: Array von (Teil-)Bauwerken
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ObservedObject'
     */
    this.router.get("/allStructures", (req, res) => this.getAllStructures(res));
    /**
     * @openapi
     * /stationsForStructure/{id}:
     *   get:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Gibt alle Stationen für ein (Teil-)Bauwerk zurück
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Array von Stationen für das (Teil-)Bauwerk
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/ObservedObject'
     */
    this.router.get("/stationsForStructure/:id", (req, res) =>
      this.getStationsForStructure(req, res)
    );
    /**
     * @openapi
     * /observedObjectType:
     *   post:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Erstellt einen neuen Observed Object Type
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *             required:
     *               - name
     *     responses:
     *       200:
     *         description: Das erstellte Observed Object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ObservedObjectType'
     */
    this.router.post("/observedObjectType", (req, res) =>
      this.createObservedObjectType(req, res)
    );
    /**
     * @openapi
     * /observedObjectTypeByName:
     *   get:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Gibt den Observed Object Type passend zum Namen zurück
     *     parameters:
     *       - in: query
     *         name: name
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Observed Object Type
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ObservedObjectType'
     */
    this.router.get(
      "/observedObjectTypeByName",
      (req: express.Request, res: express.Response) => {
        this.getObservedObjectTypeByName(req, res);
      }
    );
    /**
     * @openapi
     * /observedObject:
     *   post:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Erstellt ein neues (Teil-)Bauwerk oder eine Station
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             $ref: '#/components/schemas/ObservedObject'
     *     responses:
     *       200:
     *         description: Das erstellte (Teil-)Bauwerk oder die Station
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ObservedObject'
     */
    this.router.post(
      "/observedObject",
      (req: express.Request, res: express.Response) =>
        this.createObservedObject(req.body as ObservedObject, res)
    );
    /**
     * @openapi
     * /structure/{id}:
     *   get:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Gibt Details zu einem (Teil-)Bauwerk zurück
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: (Teil-)Bauwerk Details
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               $ref: '#/components/schemas/ObservedObject'
     */
    this.router.get(
      "/structure/:id",
      (req: express.Request, res: express.Response) =>
        this.getStructure(req.params.id, res)
    );
    /**
     * @openapi
     * /allStationGPSCoordinates:
     *   get:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Gibt alle GPS-Koordinaten der Stationen zurück
     *     responses:
     *       200:
     *         description: Array von Stationen mit GPS-Koordinaten
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   stationId:
     *                     type: string
     *                   structureId:
     *                     type: string
     *                   station:
     *                     type: string
     *                   structure:
     *                     type: string
     *                   coordinates:
     *                     type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       x:
     *                         type: number
     *                       y:
     *                         type: number
     */
    this.router.get(
      "/allStationGPSCoordinates",
      (req: express.Request, res: express.Response) =>
        this.getAllStationGPSCoordinates(res)
    );
    /**
     * @openapi
     * /observedObject/{id}:
     *   put:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Update ein (Teil-)Bauwerk oder eine Station
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       description: Partial ObservedObject mit zu updatenden Werten
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *     responses:
     *       200:
     *         description: Updated ObservedObject
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ObservedObject'
     */
    this.router.put(
      "/observedObject/:id",
      (req: express.Request, res: express.Response) =>
        this.updateObservedObject(req, res)
    );
    /**
     * @openapi
     * /createNewTeilbauwerk:
     *   post:
     *     tags:
     *       - ObservedObject ((Teil-)Bauwerk, Station)
     *     summary: Erstellt ein neues Teilbauwerk
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               parentStructureId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Erstelltes Teilbauwerk
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ObservedObject'
     */
    this.router.post(
      "/createNewTeilbauwerk",
      (req: express.Request, res: express.Response) =>
        this.createNewTeilbauwerk(req, res)
    );
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
