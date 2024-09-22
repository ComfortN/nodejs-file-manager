const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const dataDir = path.join(__dirname, 'data');
const dataFilePath = path.join(dataDir, 'shoppingList.json');

// Ensure the data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Ensure the JSON file exists and contains valid JSON
if (!fs.existsSync(dataFilePath) || fs.readFileSync(dataFilePath).length === 0) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Helper function to read and parse JSON file
const readData = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing data file:', error);
        return [];
    }
};

// Helper function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Create the HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Handle GET request to retrieve the shopping list
    if (req.method === 'GET' && pathname === '/shopping-list') {
        try {
            const data = readData();
            console.log('Get the items:', data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        } catch (error) {
            console.error('Error retrieving shopping list:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    // Handle POST request to add an item to the shopping list
    else if (req.method === 'POST' && pathname === '/shopping-list') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Received data:', body);
            try {
                console.log('Attempting to parse JSON:', body);
                const item = JSON.parse(body);
                console.log('Parsed item:', item);
                const data = readData();
                // Assign a new ID to the item
                const newId = data.length > 0 ? Math.max(...data.map(i => i.id || 0)) + 1 : 1;
                const newItem = { id: newId, ...item };
                data.push(newItem);
                writeData(data);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newItem));
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
    }

    // Handle PUT request to update an item in the shopping list
    else if (req.method === 'PUT' && pathname.startsWith('/shopping-list/')) {
        const itemId = pathname.split('/')[2];
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log('Received data for update:', body);
            try {
                const updatedItem = JSON.parse(body);
                const data = readData();
                const index = data.findIndex(item => item.id === parseInt(itemId));
                if (index !== -1) {
                    data[index] = { ...data[index], ...updatedItem };
                    writeData(data);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data[index]));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Item not found' }));
                }
            } catch (error) {
                console.error('Error processing update request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
    }

    // Handle DELETE request to remove an item from the shopping list
    else if (req.method === 'DELETE' && pathname.startsWith('/shopping-list/')) {
        const itemId = pathname.split('/')[2];
        try {
            const data = readData();
            
            const index = data.findIndex(item => item.id === parseInt(itemId));
            if (index !== -1) {
                const deletedItem = data.splice(index, 1)[0];
                writeData(data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                console.log('Deleting:', deletedItem);
                res.end(JSON.stringify({ message: 'Item deleted successfully', deletedItem }));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Item not found' }));
            }
        } catch (error) {
            console.error('Error processing delete request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
        }
    }

    // Handle invalid routes
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Route not found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});