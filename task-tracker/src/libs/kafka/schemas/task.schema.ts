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
  "name": "TaskCompleted",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "user_id", "type": "string" }
  ]
}
`;

export const assignedTaskSchema = `
{
  "type": "record",
  "name": "TaskAssigned",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "user_id", "type": "string" }
  ]
}
`;
