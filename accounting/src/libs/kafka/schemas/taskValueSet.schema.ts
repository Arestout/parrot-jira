export const taskValueSetSchema = `
{
  "type": "record",
  "name": "taskValueSet",
  "namespace": "tasks",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "value", "type": "number" }
  ]
}
`;
