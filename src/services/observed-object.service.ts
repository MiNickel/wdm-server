import { query } from "../../db";
import { ObservedObject } from "../types/observed-object";
import logger from "../util/logger";

export class ObservedObjectService {
  async createNewTeilbauwerk(station: Partial<ObservedObject>) {
    const currStation = await query<ObservedObject>(
      `SELECT o.* FROM public.observedobject o WHERE o.id = ${station.id}`
    );

    const currTeilbauwerk = await query<ObservedObject>(
      `SELECT o.* FROM public.observedobject o WHERE o.id = ${currStation.rows[0].parent_id}`
    );

    const response = await this.createObservedObject(currTeilbauwerk.rows[0]);

    try {
      const updatedStation = await query(`
        UPDATE public.observedobject
          SET parent_id = ${response.rows[0].id}
          WHERE id = ${currStation.rows[0].id};`);
      return updatedStation;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
  async getStructure(id: string) {
    const response = await query<ObservedObject>(
      `SELECT o.* FROM public.observedobject o WHERE o.id = ${id}`
    );
    return response.rows[0];
  }
  async getAllStructures(): Promise<ObservedObject[]> {
    const response = await query<ObservedObject>(
      "SELECT o.* FROM public.observedobject o JOIN public.tbl_observedobject_type t ON o.type_id = t.id WHERE t.name = 'bauwerk';"
    );
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
    const response = await query<{
      stationId: string;
      structureId: string;
      station: string;
      structure: string;
      coordinates: { x: number; y: number } | null;
    }>(
      `SELECT o.id AS "stationId", structure.id AS "structureId", o.name AS station, structure.name AS structure, ms.coordinates FROM public.observedobject o LEFT JOIN public.observedobject structure ON o.parent_id = structure.id JOIN public.messstelle_meta ms ON o.id = ms.oo_id JOIN public.tbl_observedobject_type t ON o.type_id = t.id WHERE t.name = 'station'`
    );
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
    const response = await query<ObservedObject>(
      `SELECT o.name AS name, o.id AS id, o_type.name AS type, o.parent_id as parent_id FROM public.observedobject o LEFT JOIN public.tbl_observedobject_type o_type ON o.type_id = o_type.id WHERE o.parent_id = ${id}`
    );
    return response.rows;
  }

  async createObservedObjectType(name: string) {
    const response = await query(`INSERT INTO public.tbl_observedobject_type
    (description, flatendsets, icon, "name")
    VALUES('', false, '', ${name});`);
    return response;
  }

  async getObservedObjectTypeByName(name: string) {
    const response = await query(
      `SELECT oot.id FROM public.tbl_observedobject_type oot WHERE oot.name= '${name}'`
    );
    return response.rows[0];
  }

  async createObservedObject(oo: ObservedObject) {
    const queryText = `
    INSERT INTO public.observedobject
    (collection, collection_media, completed, datacapture, description, icon, ip, mac, manualcapture, "name", parent_id, profil_id, type_id)
    VALUES($1, $2, false, false, $3, '', '', '', false, $4, $5, $6, $7)
    RETURNING id;
  `;

    const values = [
      oo.collection || "",
      oo.collection_media || "",
      oo.description || "",
      oo.name || "",
      oo.parent_id || null,
      oo.profil_id || null,
      oo.type_id || null,
    ];

    try {
      const response = await query(queryText, values);
      return response;
    } catch (error) {
      console.error("DB Error:", error);
      throw error;
    }
  }

  async updateObservedObject(
    id: string,
    observedObjectValues: Partial<ObservedObject>
  ) {
    const keys = Object.keys(observedObjectValues);
    const values = Object.values(observedObjectValues);

    const setClause = keys
      .map((key, index) => `"${key}" = $${index + 1}`)
      .join(", ");

    const queryString = `UPDATE public.observedobject SET ${setClause} WHERE id = $${
      keys.length + 1
    } RETURNING *;`;

    const response = await query(queryString, [...values, id]);
    return response;
  }
}
