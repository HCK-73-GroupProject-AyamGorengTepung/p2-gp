# Guess The Country API Documentation

> Deployment Link:
- Server: https://gtc.gdevjs.site
- Client: https://gtcp2-637b9.web.app/

## Endpoints

List of available endpoints:
- `GET /countries`

### 1. GET /countries
Description:
- Get all countries from the database

*Response (200 - OK)*
```json
[
    {
        "image": "string",
        "answer": "string"
    },
]
```

*Response (500 - Internal Server Error)*
```json
{
  "message": "Internal Server Error"
}
```