const express = require('express');
const Router = express.Router;
const path = require("path");


const router = new Router();


//сайты

router.get('/site_1', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'site1', 'index.html'));
});

router.get('/site_2', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'site2', 'index.html'));
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


module.exports = router; 