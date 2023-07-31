const { Sequelize, Op } = require("sequelize");
const db = require("../database/config");
const City = require("../database/models/City.model");
const Country = require("../database/models/Country.model");
const Item = require("../database/models/Item.model");
const User = require("../database/models/User.model");
const ItemUsageRequest = require('../database/models/ItemUsageRequest.model')

const getMatchingItems = async (
  searchParams,
) => {
  const {
    city_name,
    country_name,
    ...search_params
  } = searchParams;

  const allItems = await Item.findAll({
    where: {
      ...search_params,
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
  });


  return allItems;
};
module.exports = getMatchingItems;
