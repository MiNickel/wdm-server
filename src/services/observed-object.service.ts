import { query } from "../../db";
import { ObservedObject } from "../types/observed-object";

export class ObservedObjectService {
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

  async getStationsForStructure(id: string): Promise<ObservedObject[]> {
    const response = await query<ObservedObject>(
      `SELECT o.name AS name, o.id AS id FROM public.observedobject o WHERE o.parent_id = ${id}`
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
    const response = await query(
      `INSERT INTO public.observedobject
      (collection, collection_media, completed, datacapture, description, icon, ip, mac, manualcapture, "name", parent_id, profil_id, type_id)
      VALUES(${oo.collection || ""}, ${
        oo.collection_media || ""
      }, false, false, ${oo.description || ""}, '', '', '', false, ${
        oo.name || ""
      }, ${oo.parent_id || 0}, ${oo.profil_id || 0}, ${oo.profil_id || 0});`
    );

    return response;
  }
}
