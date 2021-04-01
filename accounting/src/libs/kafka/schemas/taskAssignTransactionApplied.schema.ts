export const taskAssignedTransactionSchema = `
{
  "type": "record",
  "name": "taskAssignedTransaction",
  "namespace": "transactions",
  "fields": [
    { "name": "user_id", "type": "string" },
    { "name": "id", "type": "string" },
    { "name": "debit", "type": "int" },
    { "name": "credit", "type": "int" }
  ]
}
`;
