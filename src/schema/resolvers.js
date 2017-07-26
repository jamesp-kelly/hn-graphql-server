module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { //3rd item is the context obj that was passed to graphqlExpress()
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    createLink: async (root, data, {mongo: {Links}, user}) => {
      const newLink = Object.assign({postedById: user && user._id}, data);
      const response = await Links.insert(data);
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

  },
  Link: {
    id: root => root._id || root.id, //resolver updates from Mongo's ._id to our schema's .id

    postedBy: async ({postedById}, data, {mongo: {Users}}) => {
      console.log('posted by is called');
      return await Users.findOne({_id: postedById});
    }
  },

  User: {
    id: root => root._id || root.id
  }
};