const authAdmin = (req, res, next) => {
  const token = "appleIphone";
  const userAuth = "apple";
  if (userAuth !== token) {
    res.status(401).send("Wrong token");
  } else {
    next();
  }
};
const authTest = (req, res, next) => {
  const token = "ankit";
  const userAuth = "ankitey";
  if (userAuth !== token) {
    res.status(401).send("Wrong token of test");
  } else {
    next();
  }
};
module.exports = {
  authAdmin,
  authTest,
};
