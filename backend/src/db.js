const uuid = require('uuid/v4');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ 
  lists: [], 
  tasks: [],
}).write();

module.exports = db;
