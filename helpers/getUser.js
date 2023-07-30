const db = require("../database/config");
const User = require('../database/models/User.model')

const byUserId = async (user_id) => {
  const result = await User.findOne({
    where: {
      user_id: user_id
    }
  })
  return result
};

const byEmail = async (email) => {
  const result = await User.findOne({
    where: {
      email: email
    }
  })
  return result
};

module.exports = {
  byEmail,
  byUserId,
};
