const express = require("express");
const { createBlog } = require("../../../controllers/blog");
const router = express.Router();
const { deleteBlog } = require("../../../controllers/blog/deleteBlog");
const { getBlog } = require("../../../controllers/blog/getBlogs");

// middlewares
const { checkAccess } = require("../../../middleware/access/checkAccess");
const { verifyToken } = require("../../../middleware/verifyToken");
const { imageUpload } = require("../../../middleware/upload");
const { updateBlog } = require("../../../controllers/blog/updateBlog");



router.get("/getBlog", getBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlog/:id", imageUpload.single("image"), updateBlog);


router.use(verifyToken, checkAccess('ADMIN', 'SENIOR_EXECUTIVE_CREATIVE'));
router.post("/createBlog", imageUpload.single("image"), createBlog);
module.exports = router;
