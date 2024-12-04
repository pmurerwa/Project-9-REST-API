//Course Model (models/course.js)

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Title of the course, cannot be empty
      validate: {
        notEmpty: {
          msg: "Title is required.",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false, // Description of the course, cannot be empty
      validate: {
        notEmpty: {
          msg: "Description is required.",
        },
      },
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING,
  });

  // Associations with the User model
  Course.associate = (models) => {
    // Many-to-one association: A course belongs to one user (owner)
    Course.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Course;
};
