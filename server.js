const express = require('express');
const {
    animals
} = require('./data/animals.json');
const fs = require('fs');
const path = require('path');

//Routes
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//Parse incoming string or array data
app.use(express.urlencoded({
    extended: true
}));
//Parse incoming JSON data
app.use(express.json());
app.use('./api', apiRoutes);
app.use('/', htmlRoutes);
//ALlow server to send css and js files without creating routes for each one
app.use(express.static('public'));


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});