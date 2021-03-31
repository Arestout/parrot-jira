export const createdUserSchema = `
  {
    "type": "record",
    "name": "UserCreated",
    "namespace": "users",
    "fields": [
      { "name": "public_id", "type": "string" },
      { "name": "fullName", "type": "string" },
      { "name": "email", "type": "string" },
      { "name": "role", "type": "string" },
      { "name": "slack", "type": "string" },
      { "name": "mobile", "type": "string" }
    ]
  }
`;

export const updatedUserSchema = `
  {
    "type": "record",
    "name": "UserUpdated",
    "namespace": "users",
    "fields": [
      { "name": "public_id", "type": "string" },
      { "name": "fullName", "type": "string" },
      { "name": "email", "type": "string" },
      { "name": "role", "type": "string" },
      { "name": "slack", "type": "string" },
      { "name": "mobile", "type": "string" }
    ]
  }
`;

export const deletedUserSchema = `
{
  "type": "record",
  "name": "UserDeleted",
  "namespace": "users",
  "fields": [
    { "name": "public_id", "type": "string" },
  ]
}
`;
