export const transactionSchema = `
{
  "type": "record",
  "name": "transaction",
  "namespace": "transactions",
  "fields": [
    { "name": "user_id", "type": "string" },
    { "name": "id", "type": "string" },
    { "name": "debit", "type": "int" },
    { "name": "credit", "type": "int" },
    { "name": "type", "type": "string" },
    { "name": "description", "type": "string" }
  ]
}
`;
