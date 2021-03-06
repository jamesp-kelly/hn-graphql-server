const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

//define types
const typeDefs = `
  type Link {
    id: ID!,
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }

  type Query {
    allLinks: [Link!]!
  }

  type Mutation {
    createLink(url: String!, description: String!): Link
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signInUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    createVote(linkId: ID!): Vote
  }

  type User {
    id: ID!
    name: String!
    email: String
    votes: [Vote!]!
  }

  type Vote {
    id: ID!
    user: User!
    link: Link!
  }

  type SigninPayload {
    token: String
    user: User
  }

  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

`;

module.exports = makeExecutableSchema({
  typeDefs, 
  resolvers
});