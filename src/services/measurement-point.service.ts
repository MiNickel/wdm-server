import { query } from "../../db";

export class MeasurementPointService {
  async updateMeasurementPointWallThickness(
    structureId: string,
    actualWallthickness: string,
    sections: string[]
  ) {
    const stationIdsQueryResponse = await query(
      `SELECT id FROM observedobject o WHERE o.parent_id = ${structureId}`
    );

    const stationsIds = stationIdsQueryResponse.rows.map(data => data.id);

    const stationsIdsQueryString = `(${stationsIds.join(", ")})`;

    const messungIdsQueryResponse = await query(
      `SELECT id FROM messung m WHERE m.observedobject_id IN ${stationsIdsQueryString}`
    );

    const messungIds = messungIdsQueryResponse.rows.map(data => data.id);
    const messungIdsQueryString = `(${messungIds.join(", ")})`;

    const sectionsQueryString = `(${sections.map(s => `'${s}'`).join(", ")})`;

    const response = await query(`UPDATE public.messungenmesspunkt
    SET tatsaechliche_ausgangswanddicke=${Number(actualWallthickness)}
    WHERE messung_id IN ${messungIdsQueryString} AND messlage IN ${sectionsQueryString};`);

    return response;
  }
}
