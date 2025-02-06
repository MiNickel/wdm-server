import { query } from "../../db";

export class FieldbookService {
  async getFieldbookForStation(stationId: string): Promise<any> {
    const responseFirst =
      await query(`SELECT structure.name AS structure, station.name AS station, ms.querschnitt_block AS block, m.anfangs_datum AS date, m.taucher AS diver, m.protokollfuehrer AS protocolLeader,
      bm.baujahr AS constructionYear, json_build_object('MThw', w.mthw, 'MTnw', w.mtnw) AS waterlevels,
      json_build_object('planRiverbed',s.plan_sohle,'currentRiverbed',s.ist_sohle) AS riverbed,
      json_build_object('name',l.name, 'picture', l.picture) AS profil
      FROM public.observedobject station 
      LEFT JOIN observedobject structure ON station.parent_id = structure.id
      LEFT JOIN public.messstelle_meta ms ON station.id = ms.oo_id
      LEFT JOIN public.messung m ON station.id = m.observedobject_id
      LEFT JOIN public.bauwerke_meta bm ON structure.id = bm.oo_id 
      LEFT JOIN public.wasserstaende w ON m.wasserstaende_id = w.id
      LEFT JOIN public.sohle s ON m.sohle_id = s.id
      LEFT JOIN public.label_labels l ON station.profil_id = l.id
      WHERE station.id = ${stationId}`);

    const measurements = await query(`
      SELECT 
    m.id AS messung_id,
    mp.id AS messpunkt_id,
    mp.messquerschnitt AS height,
    mp.messlage AS section,
    ARRAY(SELECT dicke FROM public.messungeinzeln me WHERE me.messungenmesspunkt_id = mp.id ORDER BY me.position) AS "remainingWallThickness",
    mp.geplante_wanddicke AS "wallThickness",
    mp.abstand_schlossmitte AS "distanceLockedge",
    ARRAY(SELECT tiefe FROM public.muldentiefe mt WHERE mt.messungenmesspunkt_id = mp.id ORDER BY mt.position) AS "troughDepth",
    mp.datenqualitaet AS quality,
    mp.bemerkung AS remarks
    FROM public.messung m
    LEFT JOIN public.messungenmesspunkt mp ON m.id = mp.messung_id
    WHERE m.observedobject_id = ${stationId}
    ORDER BY mp.messquerschnitt DESC, mp.messlage ASC;
      `);

    console.log(responseFirst.rows);

    return {
      ...responseFirst.rows[0],
      measurements: measurements.rows,
    };

    const response = await query<any>(
      `
SELECT 
    m.id AS measurement_id,
    ms.bezeichnung AS station,
    ms.querschnitt_block AS block,
    m.mess_datum AS date,
    m.taucher AS diver,
    m.protokollfuehrer AS protocolLeader,
    bm.baujahr AS constructionYear,
    EXTRACT(YEAR FROM AGE(m.mess_datum, bm.baujahr::TEXT::DATE)) AS age,
    w.mthw AS "waterlevels.MThw",
    w.mtnw AS "waterlevels.MTnw",
    s.plan_sohle AS "riverbed.planRiverbed",
    s.ist_sohle AS "riverbed.currentRiverbed",
    mp.messlage AS "measurements.section",
    mp.messquerschnitt AS "measurements.height",
    mp.tatsaechliche_ausgangswanddicke AS "measurements.wallThickness",
    mp.abstand_schlossmitte AS "measurements.distanceLockedge",
    mp.datenqualitaet AS "measurements.quality",
    mp.bemerkung AS "measurements.remarks",
    me.dicke AS "measurements.remainingWallThickness",
    mt.tiefe AS "measurements.troughDepth",
    ll.name AS "profil.name",
    ll.picture AS "profil.picture"
FROM public.messung m
LEFT JOIN public.messstelle_meta ms ON m.observedobject_id = ms.oo_id
LEFT JOIN public.bauwerke_meta bm ON bm.oo_id = m.observedobject_id
LEFT JOIN public.wasserstaende w ON m.wasserstaende_id = w.id
LEFT JOIN public.sohle s ON m.sohle_id = s.id
LEFT JOIN public.messungenmesspunkt mp ON mp.messung_id = m.id
LEFT JOIN public.messungeinzeln me ON me.messungenmesspunkt_id = mp.id
LEFT JOIN public.muldentiefe mt ON mt.messungenmesspunkt_id = mp.id
LEFT JOIN public.label_labels ll ON ll.id = mp.auswertung_id
WHERE m.id = ${stationId};
`
    );

    `
      SELECT 
    m.id AS messung_id,
    mp.id AS messpunkt_id,
    mp.messquerschnitt,
    mp.messlage,
    ARRAY(SELECT dicke FROM public.messungeinzeln me WHERE me.messungenmesspunkt_id = mp.id ORDER BY me.position) AS remainingWallThickness,
    mp.geplante_wanddicke AS wallThickness,
    mp.abstand_schlossmitte AS distanceLockedge,
    ARRAY(SELECT tiefe FROM public.muldentiefe mt WHERE mt.messungenmesspunkt_id = mp.id ORDER BY mt.position) AS troughDepth,
    mp.datenqualitaet,
    mp.bemerkung
    FROM public.messung m
    LEFT JOIN public.messungenmesspunkt mp ON m.id = mp.messung_id
    LEFT JOIN public.messungeinzeln me ON me.messungenmesspunkt_id = mp.id
    LEFT JOIN public.muldentiefe mt ON mt.messungenmesspunkt_id = mt.id
    WHERE m.observedobject_id = ${stationId};
      `;
    return response.rows;
  }
}
