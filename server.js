const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const cors = require('cors');

const app = express();

// API file for interating with MongoDB
const api = require('./server/routes/api');

//cors header
app.use(cors());

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular dist output folder location
app.use(express.static(path.join(__dirname, 'dist/mean')));

// API location
app.use('/api', api);

// Send all other requiests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/mean/index.html'));
});

// Set port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost: ${port}`));
