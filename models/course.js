//#Qn3 ran this command to generate the courses model.
//npx sequelize model:create --name Course --attributes title:string,description:text,estimatedTime:string,materialsNeeded:string

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define model association here
      //#Qn4. A Course belongs to a single User
      Course.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      estimatedTime: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
