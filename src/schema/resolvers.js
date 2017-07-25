const links = [
  {
    id: 1,
    url: 'http://www.pepperoni.pizza',
    description: 'number one'
  },
  {
    id: 2,
    url: 'http://api.pepperoni.pizza',
    description: 'api link'
  }
];

module.exports = {
  Query: {
    allLinks: () => links
  }
}