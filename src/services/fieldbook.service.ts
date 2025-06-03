import { query } from "../../db";

export class FieldbookService {
  async getFieldbookForStation(stationId: string): Promise<any> {
    const stationData =
      query(`SELECT bauwerk.name AS structure, station.name AS station, ms.querschnitt_block AS block, m.anfangs_datum AS date, m.taucher AS diver, m.protokollfuehrer AS "protocolLeader",
      bm.baujahr AS "constructionYear", json_build_object('MThw', w.mthw, 'MTnw', w.mtnw) AS waterlevels,
      json_build_object('planRiverbed',s.plan_sohle,'currentRiverbed',s.ist_sohle) AS riverbed,
      json_build_object('name',l.name, 'picture', l.picture) AS profil,
      ms.coordinates AS gps
      FROM public.observedobject station 
      LEFT JOIN observedobject teilbauwerk ON station.parent_id = teilbauwerk.id
      LEFT JOIN observedobject bauwerk ON teilbauwerk.parent_id = bauwerk.id
      LEFT JOIN public.messstelle_meta ms ON station.id = ms.oo_id
      LEFT JOIN public.messung m ON station.id = m.observedobject_id
      LEFT JOIN public.bauwerke_meta bm ON bauwerk.id = bm.oo_id 
      LEFT JOIN public.wasserstaende w ON m.wasserstaende_id = w.id
      LEFT JOIN public.sohle s ON m.sohle_id = s.id
      LEFT JOIN public.label_labels l ON station.profil_id = l.id
      WHERE station.id = ${stationId}`);

    const measurements = query(`
      SELECT 
    m.id AS messung_id,
    mp.id AS messpunkt_id,
    mp.messquerschnitt AS height,
    mp.messlage AS section,
    ARRAY(SELECT dicke FROM public.messungeinzeln me WHERE me.messungenmesspunkt_id = mp.id ORDER BY me.position) AS "remainingWallThickness",
    mp.geplante_wanddicke AS "wallThickness",
    mp.tatsaechliche_ausgangswanddicke AS "currentWallThickness",
    mp.abstand_schlossmitte AS "distanceLockedge",
    ARRAY(SELECT tiefe FROM public.muldentiefe mt WHERE mt.messungenmesspunkt_id = mp.id ORDER BY mt.position) AS "troughDepth",
    mp.datenqualitaet AS quality,
    mp.bemerkung AS remarks
    FROM public.messung m
    LEFT JOIN public.messungenmesspunkt mp ON m.id = mp.messung_id
    WHERE m.observedobject_id = ${stationId}
    ORDER BY mp.messquerschnitt DESC, mp.messlage ASC;
      `);

    const response = await Promise.all([stationData, measurements]);

    return {
      ...response[0].rows[0],
      measurements: response[1].rows,
    };
  }
}
