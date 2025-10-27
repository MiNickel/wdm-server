import { query } from "../../db";
import { ObservedObjectRepository } from "../repositories/observed-object.repository";
import { ObservedObject } from "../types/observed-object";
import logger from "../util/logger";

export class ObservedObjectService {
  private observedObjectRepository = new ObservedObjectRepository();

  async createNewTeilbauwerk(station: Partial<ObservedObject>) {
    const currStation = await this.observedObjectRepository.findById(
      station.id
    );

    const currTeilbauwerk = await this.observedObjectRepository.findById(
      currStation.rows[0].parent_id
    );

    const response = await this.createObservedObject(currTeilbauwerk.rows[0]);

    try {
      const updatedStation = await this.observedObjectRepository.updateParentId(
        response.rows[0].id,
        currStation.rows[0].id
      );
      return updatedStation;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getStructure(id: string) {
    const response = await this.observedObjectRepository.findById(id);
    return response.rows[0];
  }
  async getAllStructures(): Promise<ObservedObject[]> {
    const response = await this.observedObjectRepository.findAllBauwerke();
    return response.rows;
  }

  async getAllStationGPSCoordinates(): Promise<
    {
      stationId: string;
      structureId: string;
      station: string;
      structure: string;
      coordinates: number[];
    }[]
  > {
    const response = await this.observedObjectRepository.findAllStations();
    const result = response.rows;
    return result.map(
      ({ stationId, structureId, station, structure, coordinates }) => {
        return {
          stationId: stationId,
          structureId: structureId,
          station,
          structure,
          coordinates: coordinates ? [coordinates.x, coordinates.y] : [],
        };
      }
    );
  }

  async getStationsForStructure(id: string): Promise<ObservedObject[]> {
    const response = await this.observedObjectRepository.findStationByBauwerkId(
      id
    );
    return response.rows;
  }

  async createObservedObjectType(name: string) {
    const response =
      await this.observedObjectRepository.createObservedObjectType(name);
    return response;
  }

  async getObservedObjectTypeByName(name: string) {
    const response =
      await this.observedObjectRepository.getObservedObjectTypeByName(name);
    return response.rows[0];
  }

  async createObservedObject(oo: ObservedObject) {
    try {
      const response = await this.observedObjectRepository.createObservedObject(
        oo
      );
      return response;
    } catch (error) {
      logger.error("Error creating an ObservedObject", error);
      throw error;
    }
  }

  async updateObservedObject(
    id: string,
    observedObjectValues: Partial<ObservedObject>
  ) {
    const response = await this.observedObjectRepository.updateObservedObject(
      id,
      observedObjectValues
    );
    return response;
  }
}
