const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { ApiError } = require("../../utils/error/ApiError");
const uploadImage = require("../../utils/image/uploadImage");
const deleteImage = require("../../utils/image/deleteImage");
const status = require("http-status");

const updateBlog = async (req, res, next) => {
    const { id } = req.params; 

    try {
        const {
            title,
            author,
            blogLink,
            desc,
            date,
            visibility,
            approval,
            summary,
            category,
        } = req.body;

        // Check if any of the fields are null
        if (!title || !author || !blogLink || !desc || !date || !visibility || !approval || !summary || !category) {
            return next(new ApiError(status.BAD_REQUEST, "All fields are required"));
        }

        const existingBlog = await prisma.blog.findUnique({
            where: { id },
        });

        if (!existingBlog) {
            return next(new ApiError(status.NOT_FOUND, "Blog not found"));
        }

        let imageUrl = existingBlog.image;

        // repalce image is new one if provided
        if (req.file) {
            await deleteImage(existingBlog.image, "BLOG");
            const newImage = await uploadImage(req.file.path, "BLOG");
            imageUrl = newImage.secure_url;
        } else if (req.body.image && typeof req.body.image === 'string' && req.body.image.startsWith('http')) {
            imageUrl = req.body.image;
        }

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: {
                title,
                author: author ? JSON.parse(author) : existingBlog.author, // handle JSON fields
                blogLink,
                desc,
                date,
                visibility,
                approval: approval ? JSON.parse(approval) : existingBlog.approval,
                summary,
                category,
                image: imageUrl,
            },
        });

        res.status(status.OK).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        return next(new ApiError(status.INTERNAL_SERVER_ERROR, "Error updating blog", error));
    }
};

module.exports = { updateBlog };