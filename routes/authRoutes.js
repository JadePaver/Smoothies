//const { Router } = require('express');
const { Router } = require('express');
const authController = require('../controllers/authControllers');
const {requireAuth} = require('../middleware/authMiddleware')
//const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/signup', authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', authController.logout_get)
router.get('/smoothies',requireAuth,authController.smoothies_get)
router.get('/addRecipe',requireAuth,authController.addRecipe_get)
router.post('/addRecipe',requireAuth,authController.addRecipe_post)
router.delete('/deleteRecipe/:recipeId',requireAuth, authController.deleteRecipe_delete);
module.exports = router;