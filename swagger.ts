const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Spundwand API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
    components: {
      schemas: {
        Waterlevels: {
          type: "object",
          properties: {
            MThw: { type: "number" },
            MTnw: { type: "number" },
          },
        },
        Riverbed: {
          type: "object",
          properties: {
            planRiverbed: { type: "number" },
            currentRiverbed: { type: "number" },
          },
        },
        Profil: {
          type: "object",
          properties: {
            name: { type: "string" },
            picture: { type: "string" },
          },
        },
        MeasurementRow: {
          type: "object",
          properties: {
            height: { type: "string" },
            section: { type: "string" },
            remainingWallThickness: {
              type: "array",
              items: { type: "number" },
            },
            wallThickness: { type: "number" },
            distanceLockedge: { type: "number" },
            troughDepth: { type: "array", items: { type: "number" } },
            quality: { type: "string" },
            remarks: { type: "string" },
          },
        },
        Fieldbook: {
          type: "object",
          properties: {
            structure: { type: "string" },
            station: { type: "string" },
            block: { type: "string" },
            date: { type: "string", format: "date" },
            diver: { type: "string" },
            protocolLeader: { type: "string" },
            constructionYear: { type: "number" },
            age: { type: "number" },
            waterlevels: { $ref: "#/components/schemas/Waterlevels" },
            riverbed: { $ref: "#/components/schemas/Riverbed" },
            measurements: {
              type: "array",
              items: { $ref: "#/components/schemas/MeasurementRow" },
            },
            profil: { $ref: "#/components/schemas/Profil" },
          },
        },
        ObservedObject: {
          type: "object",
          properties: {
            id: { type: "number" },
            collection: { type: "string" },
            collection_media: { type: "string" },
            completed: { type: "boolean" },
            datacapture: { type: "boolean" },
            description: { type: "string" },
            icon: { type: "string" },
            ip: { type: "string" },
            mac: { type: "string" },
            manualcapture: { type: "boolean" },
            name: { type: "string" },
            parent_id: { type: "number" },
            profil_id: { type: "number" },
            type_id: { type: "number" },
          },
          required: ["id", "name", "type_id"],
        },
        ObservedObjectType: {
          type: "object",
          properties: {
            id: { type: "number" },
            description: { type: "string" },
            flatendsets: { type: "boolean" },
            icon: { type: "string" },
            name: { type: "string" },
          },
          required: ["id", "name"],
        },
      },
    },
  },
  apis: ["./src/controller/**/*.ts"], // files containing annotations as above
};

export default swaggerOptions;
