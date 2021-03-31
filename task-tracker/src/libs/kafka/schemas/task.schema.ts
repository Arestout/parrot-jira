export const createdTaskSchema = `
{
  "type": "record",
  "name": "TaskCreated",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" }
  ]
}
`;

export const completeTaskSchema = `
{
  "type": "record",
  "name": "TaskStatusChanged",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" }
  ]
}
`;

export const assignedTaskSchema = `
{
  "type": "record",
  "name": "TaskDeleted",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "public_id", "type": "string" }
  ]
}
`;
