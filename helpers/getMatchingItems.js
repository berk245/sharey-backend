const db = require("../database/config");
const Item = require("../database/models/Item.model");

const getMatchingItems = async (searchParams, currentIndex = 1, itemLimit = 50) => {
  const offset = (currentIndex - 1) * itemLimit;

  const result = await Item.findAll({
    where: searchParams,
    offset: offset,
    limit: itemLimit,
  });

  return result;
};
module.exports = getMatchingItems;
