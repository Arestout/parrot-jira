export const userSchema = `
{
  "definitions" : {
    "record:User" : {
      "type" : "object",
      "required" : [ "event_id","public_id", "fullName", "email", "role", "slack", "mobile" ],
      "additionalProperties" : false,
      "properties" : {
        "event_id": {
          "type" : "string"
        },
        "public_id": {
          "type" : "string"
        },
        "fullName" : {
          "type" : "string"
        },
        "email" : {
          "type" : "string"
        },
        "role" : {
          "type" : "string"
        },
        "slack" : {
          "type" : "string"
        },
        "mobile" : {
          "type" : "string"
        }
      }
    }
  },
  "$ref" : "#/definitions/record:User"
}
`;
