const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // First name of the user, cannot be empty
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name is required.' },
      },
    },

    // Last name of the user, cannot be empty
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name is required.' },
      },
    },

    // Email address, must be a valid email and unique
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email address must be unique.' },
      validate: {
        isEmail: { msg: 'Email address must be valid.' },
        notEmpty: { msg: 'Email address is required.' },
      },
    },

    // Password for the user, cannot be empty
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required.' },
      },
    },
  });

  // Automatically hash password before saving
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });
  
  // Associations with the Course model
  User.associate = (models) => {
    // One-to-many association: One user can have many courses
    User.hasMany(models.Course, { foreignKey: 'userId' });
  };

  return User;
};
