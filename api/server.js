const express = require('express');

const postsRouter = require('../hubs/posts-router');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    const query = req.query;
    res.status(200).json(query);
});

server.use('/api/posts', postsRouter);

module.exports = server;
