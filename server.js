const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');
const dbJson = "./db/db.json";
const uniqid = require('uniqid');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// HTML routes
// /Users/katnisszoujie/Desktop/Note-Taker-Express.js/Develop/public/index.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// API routes
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    // console.log(fs.readFileSync(dbJson));
    // const noteData = JSON.parse(fs.readFileSync(dbJson));
    fs.readFile('./db/db.json',
        { encoding: 'utf8' },
        function (err, data) {
            if (err)
                console.log(err);
            else
                res.json(JSON.parse(data))
        });
    // res.sendFile(path.join(__dirname, 'Develop/db/db.json'));
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
app.post('/api/notes', (req, res) => {
    console.log(req.body);
    fs.readFile('./db/db.json',
        { encoding: 'utf8' },
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                const db = JSON.parse(data);
                let userNote = {
                    title: req.body.title,
                    text: req.body.text,
                    id: uniqid(),
                };
                db.push(userNote);
                fs.writeFile("./db/db.json", JSON.stringify(db), function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.json(db)
                    }
                });
            }
        });
});


// DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
    let db = JSON.parse(fs.readFileSync('./db/db.json'))
    let deleteNotes = db.filter(item => item.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(deleteNotes));
    res.json(deleteNotes);

})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// App listener
app.listen(PORT, () => {
    console.log(`Server available at localhost${PORT}`);
});