const uuid = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ 
  lists: [], 
  tasks: [],
}).write();

// Create root list node
if (db.get('lists').size().value() === 0) {
  db.get('lists')
    .push({
      id: '0',
      name: null,
      root: null,
      next: null
    })
    .write();
}

module.exports = db;
