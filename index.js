const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// get cors to avoid issues with Cross-Origin once frontend is built
const cors = require('cors');

const TypeDefs = require('./schema')
const Resolvers = require('./resolvers')

const { ApolloServer } = require('apollo-server-express')

// hide secrets in environment variables
const envVars = require('dotenv');
envVars.config();

// set up the db connection string
const mongodb_atlas_url = process.env.MONGODB_URL;

// connect to db using mongoose
// mongoose.connect(mongodb_atlas_url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(success => {
//   console.log('Connected to MongoDB successfully')
// }).catch(err => {
//   console.log('Received an error while attempting to connect to MongoDB: ' + err)
// });

async function startServer() {
  try {
    await mongoose.connect(mongodb_atlas_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB successfully');
    
    const server = new ApolloServer({
      typeDefs: TypeDefs.typeDefs,
      resolvers: Resolvers.resolvers
    });

    server.listen().then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  } catch (error) {
    console.log('Received an error while attempting to connect to MongoDB: ' + error);
  }
}

startServer();

const server = new ApolloServer({
  typeDefs: TypeDefs.typeDefs,
  resolvers: Resolvers.resolvers
})

const app = express();
app.use(bodyParser.json());
app.use('*', cors());

server.applyMiddleware({app})

app.listen({ port: process.env.PORT }, () =>
  console.log(`Server listening at http://localhost:${process.env.PORT}${server.graphqlPath}`));
