const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { GraphQLServer } = require('graphql-yoga')
const dotenv = require('dotenv');
dotenv.config();

// Load resolvers
const resolvers = require('./resolvers');

// Load env
const { PORT } = process.env; 

// Create db
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ lists: [], count: 0 })
  .write()

async function main() {
  const server = new GraphQLServer({typeDefs: './src/schema.graphql', resolvers});
  server.start({ port: PORT }, ({ port }) => console.info(`server started on port ${port}`));
}

main()
  .catch(console.error);
