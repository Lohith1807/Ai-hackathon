const { LRUCache } = require('lru-cache');

const options = {
  max: 100,
  // 5 minutes max age
  ttl: 1000 * 60 * 5,
};

const cache = new LRUCache(options);

module.exports = cache;
