const router = require("express").Router();
const RecFavouriteController = require("../controllers/RecFavourite.controller.js");
const verifyAccessToken = require("../middleware/verifyAccessToken");

router.post("/add", verifyAccessToken, RecFavouriteController.addUserFavRecipe);
router.post("/del", verifyAccessToken, RecFavouriteController.deleteUserFavRecipe); //

module.exports = router;
