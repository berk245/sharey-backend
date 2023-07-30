const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config");

const Category = require("./Category.model");
const Item = require("./Item.model");
const ItemPhoto = require("./ItemPhoto.model");
const ItemReport = require("./ItemReport.model");
const ItemReview = require("./ItemReview.model");
const ItemUsage = require("./ItemUsage.model");
const ItemUsageReport = require("./ItemUsageReport.model");
const ItemUsageRequest = require("./ItemUsageRequest.model");
const User = require("./User.model");
const UserReport = require("./UserReport.model");
const UserReview = require("./UserReview.model");
const City = require("./City.model");
const Country = require("./Country.model");

const associations = async () => {
  City.belongsTo(Country, {
    foreignKey: {
      name: "country_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  Item.belongsTo(Category, {
    foreignKey: {
      name: "category_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  Item.hasMany(ItemReview, {
    foreignKey: {
      name: "reviewed_item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  Item.hasMany(ItemReport, {
    foreignKey: {
      name: "reported_item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  Item.hasMany(ItemUsageRequest, {
    foreignKey: {
      name: "item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  Item.hasMany(ItemUsage, {
    foreignKey: {
      name: "item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });

  ItemUsage.belongsTo(Item, {
    foreignKey: {
      name: "item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  })

  Item.belongsTo(User, {
    foreignKey: {
      name: "owner_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });

  User.belongsTo(City, {
    foreignKey: {
      name: "city_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });

  //User owns many items
  User.hasMany(Item, {
    foreignKey: {
      name: "owner_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User writes many user reviews
  User.hasMany(UserReview, {
    foreignKey: {
      name: "creator_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
    unique: "Unique_Review",
  });
  //every user review is about a user
  UserReview.belongsTo(User, {
    foreignKey: {
      name: "reviewed_user_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
    unique: "Unique_Review",
  });
  //User writes many user reports
  User.hasMany(UserReport, {
    foreignKey: {
      name: "creator_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //every user report is about a user
  UserReport.belongsTo(User, {
    foreignKey: {
      name: "reported_user_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User writes many item reviews
  User.hasMany(ItemReview, {
    foreignKey: {
      name: "creator_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User writes many item reports
  User.hasMany(ItemReport, {
    foreignKey: {
      name: "creator_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User writes many item usage reports
  User.hasMany(ItemUsageReport, {
    foreignKey: {
      name: "creator_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User makes many usage request applicatons
  User.hasMany(ItemUsageRequest, {
    foreignKey: {
      name: "user_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //User is the subject of many usages
  User.hasMany(ItemUsage, {
    foreignKey: {
      name: "user_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //Item review is about an item usage
  ItemReview.belongsTo(ItemUsage, {
    foreignKey: {
      name: "item_usage_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  ItemPhoto.belongsTo(Item, {
    foreignKey: {
      name: "item_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
  //Item usage is a result of an item usage request
  ItemUsage.belongsTo(ItemUsageRequest, {
    foreignKey: {
      name: "item_usage_request_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });

  //item usage report is about an item usage
  ItemUsageReport.belongsTo(ItemUsage, {
    foreignKey: {
      name: "reported_usage_id",
      allowNull: false,
      onDelete: "RESTRICT",
      onUpdate: "RESTRICT",
    },
  });
};

module.exports = associations;
