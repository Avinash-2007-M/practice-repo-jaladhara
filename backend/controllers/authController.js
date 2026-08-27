const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Function for JWT-Token Creation
const maxAge = 3 * 24 * 60 * 60; //3 days in seconds

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge
  });
}

const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: '', password: '' };

  //handle errors from login post request
  if(err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  if(err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }   

  //duplicate error code
  if(err.code === 11000) {
    errors.email = 'That email is already registered';
  }

  if(err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
    }

    return errors;
}


// Signup
module.exports.signup_post = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password
    });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000
    });

    res.status(201).json({
      user: user._id
    });

  } catch (err) {
    const errors = handleErrors(err);

    res.status(400).json({
      errors
    });
  }
};

// Login
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN DATA:", email, password);

  try {
    const user = await User.login(email, password);

    console.log("USER FOUND:", user._id);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({
      user: user._id,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err.message);

    res.status(400).json({
      error: err.message,
    });
  }
};

// Logout
module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    maxAge: 1,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successful"
  });
};