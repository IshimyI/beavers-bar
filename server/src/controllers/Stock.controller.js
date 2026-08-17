const StockService = require("../services/Stock.service");

class StockController {
  static async getUserStock(req, res) {
    const { id } = req.params;
    if (Number(id) !== res.locals.user.id) {
      return res.status(403).json({ error: "Нельзя смотреть чужой склад" });
    }
    try {
      const stock = await StockService.getUserStock(id);
      res.status(200).json(stock);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }

  static async createUserStock(req, res) {
    const { id } = req.params;
    if (Number(id) !== res.locals.user.id) {
      return res.status(403).json({ error: "Нельзя менять чужой склад" });
    }
    const { ingredientTypeId, ingredientBalance, title, strength } = req.body;
    try {
      const stock = await StockService.createUserStock(
        id,
        ingredientTypeId,
        ingredientBalance,
        title,
        strength
      );
      res.status(200).json({
        statusCode: 200,
        message: "Stock created successfully",
        stock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error", message: error.message });
    }
  }

  static async updateStockThunk(req, res) {
    const { id: userId, itemId } = req.params;
    if (Number(userId) !== res.locals.user.id) {
      return res.status(403).json({ error: "Нельзя менять чужой склад" });
    }
    const { ingredientTypeId, ingredientBalance, title, strength } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Stock item ID is required" });
    }
    try {
      const stock = await StockService.updateUserStock(
        userId,
        itemId,
        ingredientTypeId,
        ingredientBalance,
        title,
        strength
      );
      res.status(200).json({
        statusCode: 200,
        message: "Stock updated successfully",
        stock,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json((500, "Server error", null, error.message));
    }
  }

  static async deleteUserStock(req, res) {
    const { id: userId, itemId } = req.params;
    if (Number(userId) !== res.locals.user.id) {
      return res.status(403).json({ error: "Нельзя менять чужой склад" });
    }
    if (!itemId) {
      return res.status(400).json({ error: "Stock item ID is required" });
    }
    try {
      await StockService.delete(userId, Number(itemId));
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
}

module.exports = StockController;
