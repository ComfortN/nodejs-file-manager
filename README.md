# Shopping List API

This project is a Node.js application that serves as both a basic File Manager and a REST API for managing a shopping list. It uses Node.js' file system capabilities to store shopping list data in JSON format and exposes CRUD operations via HTTP endpoints.

## Features

- File Management: Creates and manages a JSON file to store shopping list data.
- RESTful API: Provides endpoints for managing shopping list items.
- CRUD Operations: Supports Create, Read, Update, and Delete operations on shopping list items.
- Error Handling: Includes basic error handling and validation.

## Requirements

- Node.js (version 12.0 or higher recommended)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/ComfortN/nodejs-file-manager.git
   cd nodejs-file-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node server.js
   ```
   The server will start running on `http://localhost:3000` by default.

2. Use the following API endpoints:

   - GET `/shopping-list`: Retrieve all shopping list items
   - POST `/shopping-list`: Add a new item to the shopping list
   - PUT `/shopping-list/:id`: Update an existing item
   - DELETE `/shopping-list/:id`: Remove an item from the shopping list

## API Examples

### Get all items

```
GET http://localhost:3000/shopping-list
```

### Add a new item

```
POST http://localhost:3000/shopping-list
Content-Type: application/json

{
  "name": "Milk",
  "quantity": 2
}
```

### Update an item

```
PUT http://localhost:3000/shopping-list/1
Content-Type: application/json

{
  "name": "Milk",
  "quantity": 3
}
```

### Delete an item

```
DELETE http://localhost:3000/shopping-list/1
```

## Testing

You can use tools like Postman or curl to test the API endpoints. Make sure to set the appropriate headers and body for each request type.

## File Structure

- `server.js`: Main application file containing both file management and API logic
- `data/shoppingList.json`: JSON file storing the shopping list data

## Error Handling

The API includes basic error handling:
- Returns 400 for invalid JSON in requests
- Returns 404 for items not found and Route not found
- Returns 500 for internal server errors
