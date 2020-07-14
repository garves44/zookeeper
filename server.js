const express = require('express');
const {
    animals
} = require('./data/animals.json');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

//Parse incoming string or array data
app.use(express.urlencoded({
    extended: true
}));
//Parse incoming JSON data
app.use(express.json());


// Find by queryParam
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //If personalityTraits is a string, place into new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    }
    //Loop through each trait in personalityTraitsArray
    personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });

    //Filtering by diet
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    //Filtering by species
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    //Filtering by name
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
};

//Find by ID
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(path.join(__dirname, './data/animals.json'),
        JSON.stringify({
            animals: animalsArray
        }, null, 2)
    );
    return animal;
};

//Validating information
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
        return false;
    }

    return true;
};

// Route request for animals.json
app.get('/api/animals/', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//Route request for specific animal or ID
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

//Post route to send data
app.post('/api/animals', (req, res) => {
    //set id based on next index value
    req.body.id = animals.length.toString();
    if (!validateAnimal(req.body)) {
        res.status(400).send('The aniomal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals);

        res.json(animal);
    }
});
//Get route to serve index.html as home page
app.get('/', (req, res) => {
    res.sendFile(.path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});