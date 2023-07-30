const { Sequelize } = require("sequelize");
const Item = require("../database/models/Item.model");

const updateItem = async (requestBody) => {
  try {
    const { item_id, user_id, ...fieldsToUpdate } = requestBody;

    const [affectedRows] = await Item.update({
      ...fieldsToUpdate,
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
    }, {
      where: {
        item_id: item_id,
        owner_id: user_id,
      },
    });

    return affectedRows;
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports = updateItem;
