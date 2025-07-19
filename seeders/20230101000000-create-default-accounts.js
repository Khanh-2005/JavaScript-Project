'use strict';
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminExists = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = 'admin@example.com' AND role = 'admin'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (adminExists.length === 0) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      await queryInterface.bulkInsert('Users', [{
        name: "Administrator",
        email: "admin@example.com",
        username: "admin",
        password: hashedAdminPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      console.log("Default admin account created successfully");
    }

    const userExists = await queryInterface.sequelize.query(
      `SELECT * FROM Users WHERE email = 'user@example.com' AND role = 'user'`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (userExists.length === 0) {
      const hashedUserPassword = await bcrypt.hash("user123", 10);
      await queryInterface.bulkInsert('Users', [{
        name: "Default User",
        email: "user@example.com",
        username: "user",
        password: hashedUserPassword,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
      console.log("Default user account created successfully");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['admin@example.com', 'user@example.com']
      }
    });
  }
}; 