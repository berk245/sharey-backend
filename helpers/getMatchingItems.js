const { Op } = require("sequelize");
const db = require("../database/config");
const City = require("../database/models/City.model");
const Country = require("../database/models/Country.model");
const Item = require("../database/models/Item.model");
const User = require("../database/models/User.model");

const getMatchingItems = async (
  searchParams,
  currentIndex = 1,
  itemLimit = 50
) => {
  const offset = (currentIndex - 1) * itemLimit;

  const { city_name, country_name, ...search_params } = searchParams;

  let items;
  // if (city_name || country_name) {
    items = await Item.findAll({
      where: search_params,
      include: [
        {
          model: User,
          attributes: ["user_id", "city_id"],
          required: true,
          include: [
            {
              model: City,
              attributes: ["city_name", 'city_id'],
              required: true,
              where: {
                city_name: city_name ? city_name : {[Op.ne]: null},
              },
              include: [
                {
                  model: Country,
                  attributes: ["country_name", 'country_id'],
                  where: {
                    country_name: country_name ? country_name : {[Op.ne]: null},
                  },
                },
              ],
            },
          ],
        },
      ],
      limit: 100,
    });
  // } 
  // else {
  //   items = await Item.findAll({
  //     where: searchParams,
  //     offset: offset,
  //     limit: itemLimit,
  //   });
  // }

  return items;
};
module.exports = getMatchingItems;
