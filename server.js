const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/public/index.html'));
})

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/db/db.json'));
});

// POST /api/notes should receive a new note to save on the request body, 
// add it to the db.json file, and then return the new note to the client. 
app.post('/api/notes', (req, res) => {
    let db = fs.readFileSync('Develop/db/db.json');
    db = JSON.parse(db);
    res.json(db);
    // creating body for note
    let userNote = {
        title: req.body.title,
        text: req.body.text,
        // creating unique id for each note
        id: uniqid(),
    };
    // pushing created note to be written in the db.json file
    db.push(userNote);
    fs.writeFileSync('Develop/db/db.json', JSON.stringify(db));
    res.json(db);

});


// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
    // reading notes form db.json
    let db = JSON.parse(fs.readFileSync('Develop/db/db.json'))
    // removing note with id
    let deleteNotes = db.filter(item => item.id !== req.params.id);
    // Rewriting note to db.json
    fs.writeFileSync('Develop/db/db.json', JSON.stringify(deleteNotes));
    res.json(deleteNotes);

})

// App listener
app.listen(PORT, () => {
    console.log(`Server available at localhost${PORT}`);
});