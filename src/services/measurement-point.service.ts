import { query } from "../../db";

export class MeasurementPointService {
  async updateMeasurementPointWallThickness(id: string, wallThickness: string) {
    const response = await query(`UPDATE public.messungenmesspunkt
    SET tatsaechliche_ausgangswanddicke=${Number(wallThickness)}
    WHERE id=${id};`);

    return response;
  }
}
