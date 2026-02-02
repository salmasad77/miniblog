const router = require("express").Router();
const ctrl = require("../controllers/category.controller");
const protect = require("../middlewares/auth.middleware");

router.get("/", ctrl.getCategories);
router.post("/", protect, ctrl.createCategory);

module.exports = router;
