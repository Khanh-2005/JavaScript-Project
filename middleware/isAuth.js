// Middleware to check if user is authenticated
const isAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  // If user is not logged in, redirect to login page
  res.redirect("/login");
};

module.exports = isAuth;
