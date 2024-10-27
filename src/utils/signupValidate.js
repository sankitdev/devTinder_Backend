const validator = require("validator");
const signupValidate = (req) => {
  const { firstName, age, gender, email, password, skills } = req.body;

  if (!firstName) {
    throw new Error("Enter FirstName");
  }
  if (firstName.length < 4 || firstName.length > 40) {
    throw new Error(
      "FirstName can't be less than 4 characters and greater than 40 characters"
    );
  }
  if (age < 12 || age > 80) {
    throw new Error("Enter age between 12 to 80");
  }

  const ALLOWED_GENDERS = ["male", "female", "other"];
  if (!ALLOWED_GENDERS.includes(gender.toLowerCase())) {
    throw new Error("Gender must be one of: male, female, or other");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Enter Email Id in correct format");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong Password");
  }
  if (skills.length === 0) {
    throw new Error("Skills Can't be Empty");
  } else if (skills.length > 20) {
    throw new Error("You have reached the maximum length for Skills");
  }
  //   if (!validator.isURL(photoUrl)) {
  //     throw new Error("Enter correct photo URL");
  //   }
};

module.exports = {
  signupValidate,
};
