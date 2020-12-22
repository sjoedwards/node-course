const yargs = require("yargs");
const note = require("./notes");

//Customise yargs version
yargs.version(`1.1.0`);

// Create add command
yargs.command({
  command: "add",
  describe: "Add a new note",
  builder: {
    title: {
      describe: "Note title",
      demandOption: true,
      type: "string",
    },
    body: {
      describe: "Note body",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    note.addNote(argv.title, argv.body);
  },
});

// Create remove command
yargs.command({
  command: "remove",
  describe: "Remove a new note",
  builder: {
    title: {
      describe: "Note title to remove",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    note.removeNote(argv.title);
  },
});

// Create list command
yargs.command({
  command: "list",
  describe: "List your notes",
  handler() {
    note.listNotes();
  },
});

// Create read command
yargs.command({
  command: "read",
  describe: "Read a note",
  builder: {
    title: {
      describe: "Note title to read",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    note.readNote(argv.title);
  },
});

yargs.parse();
