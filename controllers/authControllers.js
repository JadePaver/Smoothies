const User = require('../models/User');
const Recipe = require('../models/Recipes');
const jwt = require('jsonwebtoken');

//error handle
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'email incorrect') {
        errors.email = 'that email is not registered'
    }

    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that Password is incorrect'
    }

    //dup error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'Hello', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

// authControllers.js
module.exports.addRecipe_get = (req, res) => {
    res.render('addRecipe')
}
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.addRecipe_post = async (req, res) => {
    const { itemName, itemContent,sugar } = req.body;
    console.log(itemName, itemContent,sugar)
    try {
        const recipe = await Recipe.create({itemName, itemContent,sugar })
        console.log('New recipe added:', recipe);
        res.redirect('/');
    }
    catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).send('Error adding the recipe');
    }
}

module.exports.smoothies_get = async(req, res) => {
    try {
        // Fetch all recipes from MongoDB
        const recipes = await Recipe.find();

        // Render the "smoothies" EJS template and pass the fetched data
        res.render('smoothies', { recipes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching recipes');
    }
}
module.exports.deleteRecipe_delete = async (req, res) => {
    const recipeId = req.params.recipeId;

    try {
        // Delete the recipe from the database using the recipeId
        const result = await Recipe.findByIdAndDelete(recipeId);
        console.log("Succesfully deleted to DB: ID-"+recipeId)
        if (result) {
            res.status(200).send('Recipe deleted successfully');
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the recipe');
    }
}