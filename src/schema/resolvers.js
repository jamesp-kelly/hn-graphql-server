const { ObjectID } = require('mongodb');

module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { //3rd item is the context obj that was passed to graphqlExpress()
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    createLink: async (root, data, {mongo: {Links}, user}) => {
      const newLink = Object.assign({postedById: user && user._id}, data);
      const response = await Links.insert(newLink);
      return Object.assign({id: response.insertedIds[0]}, newLink);
    },
    createUser: async (root, data, {mongo: {Users}}) => {
      const newUser = {
        name: data.name,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      };
      const response = await Users.insert(newUser);
      return Object.assign({id: response.insertedIds[0]}, data);
    },
    signInUser: async (root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.email.email});
      if (data.email.password === user.password) {
        return {token: `token-${user.email}`, user};
      }
    },
    createVote: async (root, data, {mongo: {Votes}, user}) => {
      const newVote = {
        userId: user && user._id,
        linkId: new ObjectID(data.linkId)
      };
      const response = await Votes.insert(newVote);
      return Object.assign({id: response.insertedIds[0]}, newVote);
    }
  },
  Link: {
    id: root => root._id || root.id, //resolver updates from Mongo's ._id to our schema's .id

    postedBy: async ({postedById}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load(postedById);
    },

    votes: async ({_id}, data, {mongo: {Votes}}) => {
      return await Votes.find({linkId: _id}).toArray();
    }
  },

  User: {
    id: root => root._id || root.id,

    votes: async ({_id}, data, {mongo: {Votes}}) => {
      return await Votes.find({userId: _id}).toArray();
    }
  },

  Vote: {
    id: root => root._id || root.id,

    user: async ({userId}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load({userId});
    },
    link: async ({linkId}, data, {mongo: {Links}}) => {
      return await Links.findOne({_id: linkId});
    }
  }
};