const uuid = require('uuid').v4;
const { TASKS, ROOT_NODE_ID, LISTS } = require('./constants');
const { sortLinkedList } = require('./sort');

// database factored functions
const findInCollection = (id , db, collection) => db.get(collection).find({ id });

const Query = {
  async project (r, _, { db }) {
    const sortedLists = sortLinkedList(db.get(LISTS).value(), ROOT_NODE_ID, false);
    return {
      lists: sortedLists.map(l => l.id),
    };
  },
  async list(r, { id }, { db }) {
    const l = findInCollection(id, db, LISTS).value();
    return ({
      ...l,
      tasks: sortLinkedList(db.get(TASKS)
        .filter({listID : l.id})
        .value(), l.root, true),
    });
  },
  async task(r, { id }, { db }) {
    return findInCollection(id, db, TASKS).value();
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

    // BAD: weird issue where lowdb does not recognise the root node I've manually inserted...
    const rootNode = findInCollection(ROOT_NODE_ID, db, LISTS);
    if (!rootNode()){
       db.get(LISTS).push({
        id: ROOT_NODE_ID, 
        next: null,
        name: "root"
      }).write();
    }

    if (rootNode().next === null) {
      // Add first list
      findInCollection(ROOT_NODE_ID, db, LISTS)
        .assign({ next: newList.id })
        .write();
    } else {
      // Link list at the end to new list
      db.get(LISTS)
        .find({ next: null })
        .assign({ next: newList.id })
        .write();
    }

    // Insert new list
    db.get(LISTS)
      .push(newList)
      .write();

    console.info(`Added List ${JSON.stringify(newList, null, 2)}`);

    return ({
      ...findInCollection(newList.id, db, LISTS).value(),
      tasks: [],
    });
  },
  async listUpdate(r, { input }, { db }) {
    const { id, name } = input;

    const list = findInCollection(id, db, LISTS).value();
    if (!list) return new Error('List does not exist');

    db.get(LISTS)
      .find({ id })
      .assign({ 
        name, 
      })
      .write();

    return findInCollection(id, db, LISTS).value();
  },
  async listDestroy(r, { id }, { db }) {
    const list = db.get(LISTS).find({ id }).value();
    if (!list || id === ROOT_NODE_ID) return new Error('List does not exist');

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

    const list = db.get(LISTS).find({ id: listID }).value();
    if (!list) return new Error('List does not exist');

    if (list.root === null) {
      db.get(LISTS)
        .find({ id: listID })
        .assign({ root: newTask.id })
        .write();
    } else {
      db.get(TASKS)
      .find({ 
        listID: listID,
        next: null
      })
      .assign({ next: newTask.id })
      .write();
    }

    db.get(TASKS)
      .push(newTask)
      .write();

    console.info(`PUSH ${JSON.stringify(newTask, null, 2)}`);

    return findInCollection(newTask.id, db, TASKS).value();
  },
  async taskUpdate(r, { input }, { db }) {
    const { id, description, done, date } = input

    const task = db.get(TASKS).find({ id }).value();
    if (!task) return new Error('Task does not exist');

    db.get(TASKS)
      .find({ id })
      .assign({ 
        description: input.description,
        done: input.done,
        date: input.date,
      })
      .write();

    console.info(`UPDATE ${JSON.stringify(input, null, 2)}`);

    return db.get(TASKS).find({ id }).value();
  },
  async taskDestroy(r, { id }, { db }) {
    const task = findInCollection(id, db, TASKS).value();
    if (!task) return new Error('Task does not exist');
    const list = findInCollection(task.listID, db, LISTS).value();
    if (!list) return new Error('List does not exist');

    // Update list if task is root node
    if (list.root === task.id) {
      db.get(LISTS)
      .find({ id: list.id })
      .assign({ root: task.next })
      .write();
    }
    
    // Update previous node to next
    db.get(TASKS)
      .find({
        listID: task.listID,
        next: task.id,
      })
      .assign({ next: task.next })
      .write();

    db.get(TASKS)
      .remove({ id })
      .write();

    console.info(`DELETE ${JSON.stringify(task, null, 2)}`);

    return true;
  },
  // TODO: implement reorder for lists and tasks
  async reorder(r, { input }, { db }) {
    const { fromID, toID } = input;
    const source = db.get(TASKS).find({id: fromID}).value();
    const target = db.get(TASKS).find({id: toID}).value();
    const sourcePrev = db.get(TASKS).find({next: source.id}).value();
    const targetPrev = db.get(TASKS).find({next: target.id}).value();

    if (target.id !== source.next) {
      if (sourcePrev === undefined) {
        // Update the source list's root node to the source's next node
        db.get(LISTS).find({ id: source.listID }).assign({ root: source.next }).write();
      } else {
        // Point the source's previous node to the source's next node
        db.get(TASKS).find({ id: sourcePrev.id }).assign({ next: source.next }).write();
      }
      if (targetPrev === undefined) {
        // Update the target list's root node to the source node
        db.get(LISTS).find({ id: target.listID }).assign({ root: source.id }).write();
      } else {
        // Point the target's previous node to the source node
        db.get(TASKS).find({ id: targetPrev.id }).assign({ next: source.id }).write();
      }
      // Point the source to the target
      db.get(TASKS).find({ id: source.id }).assign({ next: target.id, listID: target.listID }).write();
    } else {
      // Point the source node to the target's next node
      db.get(TASKS).find({ id: source.id }).assign({ next: target.next }).write();
      // Point the target node to the source node
      db.get(TASKS).find({ id: target.id }).assign({ next: source.id }).write();
      if (sourcePrev === undefined){
        // Update the source list's root node to the target node
        db.get(LISTS).find({ id: source.listID }).assign({ root: target.id }).write();
      } else {
        // Point the source's previous node to the target node
        db.get(TASKS).find({ id: sourcePrev.id }).assign({ next: target.id }).write();
      }
    }

    return true;
  },
};

module.exports = {
  Query,
  Mutation,
};
