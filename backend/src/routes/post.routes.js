const router = require("express").Router();
const protect = require("../middlewares/auth.middleware");
const ctrl = require("../controllers/post.controller");
const upload = require("../middlewares/upload.middleware");


router.get("/", ctrl.getPosts);
router.get("/", ctrl.getPosts);
router.get("/:id", ctrl.getPostById);

router.post("/:id/like", protect, ctrl.likePost);
router.post("/:id/comment", protect, ctrl.addComment);
router.delete("/:id", protect, ctrl.deletePost);

router.post(
  "/create",
  protect,
  upload.single("image"),
  ctrl.createPost
);
module.exports = router;
