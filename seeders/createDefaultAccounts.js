const bcrypt = require("bcryptjs");
const { User } = require("../models");

async function createDefaultAccounts() {
  try {
    // Create default admin account
    const adminExists = await User.findOne({
      where: {
        email: "admin@example.com",
        role: "admin",
      },
    });

    if (!adminExists) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Administrator",
        email: "admin@example.com",
        username: "admin",
        password: hashedAdminPassword,
        role: "admin",
      });
      console.log("Default admin account created successfully");
    }

    // Create default user account
    const userExists = await User.findOne({
      where: {
        email: "user@example.com",
        role: "user",
      },
    });

    if (!userExists) {
      const hashedUserPassword = await bcrypt.hash("user123", 10);
      await User.create({
        name: "Default User",
        email: "user@example.com",
        username: "user",
        password: hashedUserPassword,
        role: "user",
      });
      console.log("Default user account created successfully");
    }
  } catch (error) {
    console.error("Error creating default accounts:", error);
  }
}

module.exports = createDefaultAccounts;
