const router = require("express").Router();
const IngredientController = require("../controllers/Ingredient.controller.js");
const verifyAccessToken = require("../middleware/verifyAccessToken");

router.get("/", IngredientController.getIngredients);
router.get("/:id", IngredientController.getIngredient);
router.post("/", verifyAccessToken, IngredientController.addIngredient);
router.put("/:id", verifyAccessToken, IngredientController.updateIngredient);
router.delete("/:id", verifyAccessToken, IngredientController.removeIngredient);

module.exports = router;
