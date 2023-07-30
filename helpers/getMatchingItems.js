const { Sequelize, Op } = require("sequelize");
const db = require("../database/config");
const City = require("../database/models/City.model");
const Country = require("../database/models/Country.model");
const Item = require("../database/models/Item.model");
const User = require("../database/models/User.model");
const ItemUsage = require("../database/models/ItemUsage.model");

const getMatchingItems = async (
  searchParams,
  currentIndex = 1,
  itemLimit = 50
) => {
  const {
    city_name,
    country_name,
    available_from = Sequelize.literal("CURRENT_TIMESTAMP"),
    available_to = '',
    ...search_params
  } = searchParams;

  const allItems = await Item.findAll({
    where: {
      ...search_params,
      // Add a nested subquery to filter out items with 'accepted' ItemUsageRequests
      // [Op.not]: {
      //   "$User.ItemUsageRequests$": {
      //     status: "accepted",
      //     start_date: {
      //       [Op.lte]: available_from,
      //     },
      //     end_date: {
      //       [Op.gte]: available_to,
      //     },
      //   },
      // },
    },
    include: [
      {
        model: User,
        attributes: ["user_id", "city_id"],
        required: true,
        include: [
          {
            model: City,
            attributes: ["city_name", "city_id"],
            required: true,
            where: {
              city_name: city_name ? city_name : { [Op.ne]: null },
            },
            include: [
              {
                model: Country,
                attributes: ["country_name", "country_id"],
                where: {
                  country_name: country_name ? country_name : { [Op.ne]: null },
                },
              },
            ],
          },
        ],
      },
    ],
    limit: 100,
  });

  return allItems;
};
module.exports = getMatchingItems;
