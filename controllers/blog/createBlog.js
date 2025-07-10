const { ApiError } = require("../../utils/error/ApiError");
const { PrismaClient } = require("@prisma/client");
const uploadImage = require("../../utils/image/uploadImage");
const prisma = new PrismaClient();
const status = require("http-status");

const createBlog = async (req, res, next) => {
  try {
    // validate fields
    const {
      title,
      author,
      blogLink,
      desc,
      date,
      visibility,
      approval,
      summary,
      image
    } = req.body;

    if (!title || !author || !blogLink || !desc || !date) {
      return next(new ApiError(status.BAD_REQUEST, "All required fields must be provided"));
    }

    // handle image
    let imageUrl = null;
    const isValidImageUrl = (url) => {
      return typeof url === 'string' && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
    };

    if (req.file) {
      const uploaded = await uploadImage(req.file.path, "BLOG");
      imageUrl = uploaded.secure_url;
    } else if (isValidImageUrl(image)) {
      imageUrl = image;
    } else {
      return next(new ApiError(status.BAD_REQUEST, "A valid blog image is required (upload or URL)"));
    }

    // create blog
    const blog = await prisma.blog.create({
      data: {
        image: imageUrl,
        title,
        author,
        blogLink,
        desc,
        date,
        visibility,
        approval,
        summary,
      },
    });

    res.status(status.OK).json({ message: "Blog created successfully", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    next(new ApiError(status.INTERNAL_SERVER_ERROR, "An error occurred while creating the blog"));
  }
};

module.exports = { createBlog };
