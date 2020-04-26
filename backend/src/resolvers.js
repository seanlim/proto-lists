const uuid = require('uuid/v4');

const TASKS = 'tasks';
const LISTS = 'lists';

const Query = {
  async lists(root, { id }, { db }) {
    const lists = db.get(LISTS).value();
    const tasks = db.get(TASKS).value();

    return lists.map(l => ({
      ...l,
      tasks: !tasks ? []: tasks.filter(t => t.listID === l.id)
    }));
  },
};
const Mutation = {
  async listCreate(root, { input }, { db }) {
    const { name } = input;

    const newList = {
      id: uuid(),
      name,
      tasks: [],
    };

    db.get(LISTS)
      .push(newList)
      .write();

    console.info(`PUSH ${JSON.stringify(newList, null, 2)}`);

    return newList;
  },
  async listUpdate(root, { input }, { db }) {
    const { id, name } = input;

    const list = db.get(LISTS).find({ id }).value();
    if (!list) return new Error('List does not exist');

    db.get(LISTS)
      .find({ id })
      .assign({ name })
      .write();

    return db.get(LISTS).find({id}).value();
  },
  async listDestroy(root, { id }, { db }) {
    const list = db.get(LISTS).find({ id }).value();
    if (!list) return new Error('List does not exist');

    db.get(LISTS)
      .remove({id})
      .write();

    console.info(`DELETE ${JSON.stringify(list, null, 2)}`);

    return true;
  },
  async taskCreate(root, { input }, { db }) {
    const { listID, order, description, date } = input;

    const newTask = {
      id: uuid(),
      listID,
      order,
      description,
      done: false,
      date,
    }

    db.get(TASKS)
      .push(newTask).write();

    console.info(`PUSH ${JSON.stringify(newTask, null, 2)}`);

    return newTask;
  },
  async taskUpdate(root, { input }, { db }) {
    const { id, listID, order, description, done, date } = input

    const task = db.get(TASKS).find({ id }).value();
    if (!task) return new Error('Task does not exist');

    db.get(TASKS)
      .find({ id })
      .assign({ ...input })
      .write();

    console.info(`UPDATE ${JSON.stringify(input, null, 2)}`);

    return db.get(TASKS).find({ id }).value();
  },
  async taskDestroy(root, { id }, { db }) {
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
