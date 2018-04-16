const express = require("express");
const router = express.Router();
const checkAuth = require('.././../auth/check-auth');
const productController = require('.././../controllers/product');

//authenticated endpoints
router.get("/", checkAuth, productController.products_get_all);
router.get("/:productId",  productController.products_get);
router.post("/", checkAuth, productController.products_create);
router.put("/:productId", checkAuth, productController.products_update);
router.delete("/:productId", checkAuth, productController.products_delete);

module.exports = router;
