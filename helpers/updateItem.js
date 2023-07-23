const db = require("../database/config");
const Item = require("../database/models/Item.model");

const updateItem = async (requestBody) => {
  try {
    const { item_id, user_id, ...fieldsToUpdate } = requestBody;

    console.log(fieldsToUpdate);

    const [affectedRows] = await Item.update(fieldsToUpdate, {
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
