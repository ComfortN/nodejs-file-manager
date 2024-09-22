const http = require('http');
const fs = require('fs');
const path = require('path');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    

    // Handle GET request to retrieve the shopping list
    if (req.method === 'GET' && req.url === '/shopping-list') {
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
    else if (req.method === 'POST' && req.url === '/shopping-list') {
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
                data.push(item);
                writeData(data);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(item));
            } catch (error) {
                console.error('Error processing request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
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