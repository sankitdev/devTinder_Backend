const authAdmin = (req, res, next) => {
  const token = "appleIphone";
  const userAuth = "apple";
  if (userAuth !== token) {
    res.status(401).send("Wrong token");
  } else {
    next();
  }
};

module.exports = {
  authAdmin,
};
