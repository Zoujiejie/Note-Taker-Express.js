const path = require('path');
const fs = require('fs')
var uniqid = require('uniqid');

module.exports = (app) => {

  // GET /api/notes should read the db.json file and return all saved notes as JSON.
  app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop/db/db.json'));
  });

  // POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. 
  app.post('/api/notes', (req, res) => {
    let db = fs.readFileSync('Develop/db/db.json');
    db = JSON.parse(db);
    res.json(db);

    let inputNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };

    db.push(inputNote);
    fs.writeFileSync('Develop/db/db.json', JSON.stringify(db));
    res.json(db);
  });

  // DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete.
  app.delete('/api/notes/:id', (req, res) => {
    let db = JSON.parse(fs.readFileSync('Develop/db/db.json'))
    let deleteNotes = db.filter(item => item.id !== req.params.id);
    fs.writeFileSync('db/db.json', JSON.stringify(deleteNotes));
    res.json(deleteNotes);
  })
};