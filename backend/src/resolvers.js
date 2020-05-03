const uuid = require('uuid').v4;

const TASKS = 'tasks';
const ROOT_NODE_ID = '0';
const LISTS = 'lists';

const Query = {
  async data(r, _, { db }) {
    let data = db.getState();
    data.lists = data.lists.filter(l => l.id !== ROOT_NODE_ID);
    return data;
  },
};
const Mutation = {
  async listCreate(r, { input }, { db }) {
    const { name } = input;

    const newList = {
      id: uuid(),
      name,
      root: null,
      next: null,
    };

    console.log(db.get(LISTS).size().value());

    if (db.get(LISTS).size().value() === 1) {
      db.get(LISTS)
        .find({ id: ROOT_NODE_ID })
        .assign({ next: newList.id })
        .write();
      console.log(db.getState());
    } else {
      db.get(LISTS)
        .find({ next: null })
        .assign({ next: newList.id })
        .write();
    }

    db.get(LISTS)
      .push(newList)
      .write();

    console.info(`Added List ${JSON.stringify(newList, null, 2)}`);

    return db.get(LISTS).value().filter(l => l.id !== ROOT_NODE_ID);
  },
  async listUpdate(r, { input }, { db }) {
    const { id, name, root } = input;

    const list = db.get(LISTS).find({ id }).value();
    if (!list) return new Error('List does not exist');

    db.get(LISTS)
      .find({ id })
      .assign({ 
        name, 
        root
      })
      .write();

    return db.get(LISTS).find({id}).value();
  },
  async listDestroy(r, { id }, { db }) {
    const list = db.get(LISTS).find({ id }).value();
    if (!list) return new Error('List does not exist');

    // Update previous node to next
    db.get(LISTS)
      .find({ next: list.id })
      .assign({ next: list.next })
      .write();

    // Remove list
    db.get(LISTS)
      .remove({id})
      .write();

    // Remove all tasks associated to list
    db.get(TASKS)
      .remove({listID: id})
      .write();

    console.info(`DELETE ${JSON.stringify(list, null, 2)}`);

    return true;
  },
  async taskCreate(r, { input }, { db }) {
    const { listID, description, date } = input;

    const newTask = {
      id: uuid(),
      listID,
      next: null,
      description,
      done: false,
      date,
    }

    db.get(TASKS)
      .push(newTask)
      .write();

    console.info(`PUSH ${JSON.stringify(newTask, null, 2)}`);

    return newTask;
  },
  async taskUpdate(r, { input }, { db }) {
    const { id, listID, next, description, done, date } = input

    const task = db.get(TASKS).find({ id }).value();
    if (!task) return new Error('Task does not exist');

    db.get(TASKS)
      .find({ id })
      .assign({ ...input })
      .write();

    console.info(`UPDATE ${JSON.stringify(input, null, 2)}`);

    return db.get(TASKS).find({ id }).value();
  },
  async taskDestroy(r, { id }, { db }) {
    const task = db.get(TASKS).find({id}).value();
    if (!task) return new Error('Task does not exist');

    db.get(TASKS)
      .remove({ id })
      .write();

    console.info(`DELETE ${JSON.stringify(task, null, 2)}`);

    return true;
  },
};

module.exports = {
  Query,
  Mutation,
};
