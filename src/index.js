const express = require('express');
const bodyParser = require('body-parser'); //parses JSON requests
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const buildDataloaders = require('./dataloaders');
const schema = require('./schema');
const connectMongo = require('./mongo-connector');
const { authenticate } = require('./authentication');

const start = async () => {

  const mongo = await connectMongo();
  var app = express();

  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
        dataloaders: buildDataloaders(mongo),
        mongo, 
        user}, //this context is passed to each resolver
      schema
    };
  };

  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-test@test.com'` 
  }));

  const PORT = 3000;

  app.listen(PORT, () => {
    console.log(`Hackernews GraphQL server running on port: ${PORT}`);
  });
}

start();
