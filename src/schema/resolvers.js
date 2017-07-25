module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => { //3rd item is the context obj that was passed to graphqlExpress()
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    createLink: async (root, data, {mongo: {Links}}) => {
      const response = await Links.insert(data);
      return Object.assign({id: response.insertedIds[0]}, data);
    }
  },

  Link: {
    id: root => root._id || root.id //resolver updates from Mongo's ._id to our schema's .id
  }
};