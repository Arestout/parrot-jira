export const createdTaskSchema = `
{
  "type": "record",
  "name": "TaskCreated",
  "namespace": "tasks",
  "fields": [
    { "name": "event_id", "type": "string" },
    { "name": "id", "type": "string" },
  ]
}
`;

export const changedTaskStatusSchema = `
{
  "type": "record",
  "name": "TaskDeleted",
  "namespace": "tasks",
  "fields": [
    { "name": "event_id", "type": "string" },
    { "name": "id", "type": "string" },
    { "name": "completed", "type": "boolean" },
  ]
}
`;

export const assignedTaskSchema = `
{
  "type": "record",
  "name": "TaskDeleted",
  "namespace": "tasks",
  "fields": [
    { "name": "event_id", "type": "string" },
    { "name": "id", "type": "string" },
    { "name": "public_id", "type": "string" },
  ]
}
`;
