export const headerSchema = `
  {
    "type": "record",
    "name": "UserHeader",
    "namespace": "users",
    "fields": [
      { "name": "event_id", "type": "string" },
      { "name": "event_version", "type": "enum", "name": "version",  "symbols": ["1"] },
      { "name": "event_name", "type": "enum", "name": "name",  "symbols": ["UserCreated", "UserUpdated", "UserDeleted"] },
      { "name": "event_time", "type": "string" },
      { "name": "producer", "type": "string" }
    ]
  }
`;
