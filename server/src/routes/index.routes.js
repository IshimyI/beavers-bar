const router = require("express").Router();
const authRoutes = require("./auth.routes");
const ingredientRoutes = require("./ingredient.routes");
const recipeRoutes = require("./recipe.routes");
const stockRoutes = require("./stock.routes");
const StorageRoutes = require("../routes/storage.router");
const recfavouritesRoutes = require("../routes/recfavourites.routes");
const formatResponse = require("../utils/formatResponse");

router.use("/auth", authRoutes);
router.use("/ingredient", ingredientRoutes);
router.use("/recipe", recipeRoutes);
router.use("/recfavourite", recfavouritesRoutes);
router.use("/stock", stockRoutes);
router.use("/shop-storage", StorageRoutes);
router.use("*", (req, res) => {
  res.status(404).json(formatResponse(404, "Not found"));
});

module.exports = router;
