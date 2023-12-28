"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Product.belongsTo(models.User, {
                foreignKey: "user_id",
                as: "user",
            });
        }
    }
    Product.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.TEXT,
            price: DataTypes.INTEGER,
            author: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Product",
        }
    );
    return Product;
};
