# Azure Cosmos DB Schematics

### v1
**User Document:**
```
{
  "id": "user1",
  "entityType": "user",
  "username": "exampleuser",
  "passwordHash": "$2b$10$EIX/hzHj.j0R2kR8xEixAe0cU/OPaJlf6f5c6FnQy/oeT2G4f4.AW", // hashed password
  "email": "user@example.com"
}
```

**Note Document:**
```
{
  "id": "note1",
  "entityType": "note",
  "userId": "user1",
  "title": "First Note",
  "content": "This is the content of the first note.",
  "createdAt": "2024-05-15T12:34:56Z",
  "tags": ["personal", "important"]
}
```
