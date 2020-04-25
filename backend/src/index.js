const { GraphQLServer } = require('graphql-yoga')
const dotenv = require('dotenv');
dotenv.config();

// Load resolvers
const resolvers = require('./resolvers');

// Load env
const { PORT } = process.env; 

// Load DB
const db = require('./db');

async function main() {
  const server = new GraphQLServer({
    typeDefs: './src/schema.graphql', 
    resolvers,
    context: ctx => ({db, ...ctx}),
  });
  server.start({ port: PORT }, ({ port }) => console.info(`server started on port ${port}`));
}

main()
  .catch(console.error);
