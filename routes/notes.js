const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new notes
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      id: uuidv4(),
      title,
      text,
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.error('Error in adding note');
  }
});

// DELETE Route for a notes
notes.delete('/:id', (req, res) => {
  // get id param
  // console.log(req.params.id);

  const notesOg = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
  const notesNew = notesOg.filter(item => item.id !== req.params.id);

  writeToFile('./db/db.json', notesNew);

  console.log(`Deleted note with id: ${req.params.id}`);

  res.json(notesNew);
});

module.exports = notes;
