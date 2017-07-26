const DataLoader = require('dataloader');

async function batchUsers(Users, keys) {
  return await Users.find({_id: {$in: keys}}).toArray();
}

module.exports = ({Users}) => ({
  userLoader: new DataLoader(
    (keys) => {
      return batchUsers(Users, keys)
    },
    {
      cacheKeyFn: (key) => {
        return key.toString();
      }
    }
  ),
});