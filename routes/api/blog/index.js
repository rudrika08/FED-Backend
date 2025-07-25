const express = require("express");
const { createBlog } = require("../../../controllers/blog/createBlog");
const router = express.Router();
const { deleteBlog } = require("../../../controllers/blog/deleteBlog");
const { getBlog } = require("../../../controllers/blog/getBlogs");

// middlewares
const { checkAccess } = require("../../../middleware/access/checkAccess");
const { verifyToken } = require("../../../middleware/verifyToken");
const { imageUpload } = require("../../../middleware/upload");
const { updateBlog } = require("../../../controllers/blog/updateBlog");


// public routes
router.get("/getBlog", getBlog);

//check access
router.use(verifyToken, checkAccess('ADMIN', 'SENIOR_EXECUTIVE_CREATIVE'));
router.post("/createBlog", imageUpload.single("image"), createBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.put("/updateBlog/:id", imageUpload.single("image"), updateBlog);


module.exports = router;
