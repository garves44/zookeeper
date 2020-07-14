const express = require('express');
const {
    animals
} = require('./data/animals.json');

const app = express();
const PORT = 3001;

// Filter function
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

// Route request for animals.json
app.get('/api/animals/', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});