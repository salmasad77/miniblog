const router = require("express").Router();
const ctrl = require("../controllers/contact.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", ctrl.sendMessage);
router.get("/", protect, ctrl.getMessages);

module.exports = router;
