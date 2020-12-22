const { default: chalk } = require("chalk");
const { readFileSync, writeFileSync } = require("fs");

const removeNote = (title) => {
  const notes = loadNotes();

  const noteExists = notes.some((note) => note.title === title);

  if (noteExists) {
    const filteredNotes = notes.filter((note) => note.title !== title);
    saveNotes(filteredNotes);
    console.log(chalk.green.inverse(`Note removed with title ${title}`));
  } else {
    console.log(chalk.red.inverse(`Note does not exist with title ${title}`));
  }
};

const addNote = (title, body) => {
  const notes = loadNotes();

  const duplicateNote = notes.find((note) => note.title === title);

  if (!duplicateNote) {
    notes.push({
      title,
      body,
    });
    saveNotes(notes);
    console.log("Note added");
  } else {
    console.log("Note title taken");
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  writeFileSync("notes.json", dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = readFileSync("notes.json");
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const listNotes = () => {
  const notes = loadNotes();
  console.log(chalk.green("Your notes"));
  notes.forEach((note) => console.log(chalk.blue(`- ${note.title}`)));
};

const readNote = (title) => {
  const notes = loadNotes();
  const note = notes.find((note) => note.title === title);
  if (note) {
    console.log(chalk.green(title));
    console.log(`\n\n ${note.body}`);
  } else {
    console.log(chalk.red(`No note found with title ${title}`));
  }
};

module.exports = { addNote, removeNote, listNotes, readNote };
