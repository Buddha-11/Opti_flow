const User = require("../models/User");
const jwt = require('jsonwebtoken');


// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '',username: '', password: '' };

  if (err.message === 'User not found') {
    errors.email = 'Invalid credentials';
    errors.username = 'Invalid credentials';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000 && err.message.includes('email')) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // duplicate username error
  if (err.code === 11000 && err.message.includes('username')) {
    errors.username = 'That username is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'net ninja secret', {
    expiresIn: maxAge
  });
};



//controller actions
module.exports.signup_get = (req, res) => {
  
}


module.exports.login_get = (req, res) => {
 
}



module.exports.signup_post = async (req, res) => {
  const { email, username, password , designation } = req.body;

  try {
    const user = await User.create({ email,username, password , designation});
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id, username: user.username });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

module.exports.signupAdmin_post = async (req, res) => {
  const { email, password ,username , designation } = req.body;
  const admin=true;
  try {
    const user = await User.signup(email, username ,password,admin , designation);

    // Create a token and storing it in a cookie
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true, 
      maxAge:  24 * 60 * 60 * 1000 // 1 days duration of the cookie
    });

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.loginAdmin_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password  );
    if (!user.admin) {
      console.log(user._id);
      console.log(user.admin);
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
    // Create a token and storing it in a cookie
    const token = createToken(user._id);
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'Lax', // Allows cookies for cross-origin requests
      secure: false, 
      maxAge:24 * 60 * 60 * 1000 // 1 days duration of the cookie
    });
    console.log(res.cookie);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.login_post = async (req, res) => {
  const {email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, username: user.username });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}



module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');

}