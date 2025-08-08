const Product = require("../models/productSchema");
const Charity = require("../models/charitySchema");
const Category = require("../models/categorySchema");
const { uploadToCloudinary } = require("../utils/cloudinary");

async function createProduct(req, res) {
    try {
        const {
            title,
            short_description,
            long_description,
            quantity,
            price,
            discount,
            status,
            charity_id,
            category_id
        } = req.body;

        if (req.user.role !== "admin" && req.user.role !== "super_admin") {
            return res.status(403).json({
                status: "Failed",
                message: "Only admin and super admin can create a product."
            });
        }

        if (req.user.role === "admin") {
            const charity = await Charity.findOne({
                _id: charity_id,
                user_id: req.user._id
            });
            if (!charity) {
                return res.status(403).json({
                    status: "Failed",
                    message: "You can only add products to your own charities."
                });
            }
            const category = await Category.findOne({
                _id: category_id,
                user_id: req.user._id
            });
            if (!category) {
                return res.status(403).json({
                    status: "Failed",
                    message: "You can only use categories you created."
                });
            }
        }
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                status: "Failed",
                message: "Image is required."
            });
        }
        const imageUpload = await uploadToCloudinary(req.file.buffer);

        const product = await Product.create({
            title,
            short_description,
            long_description,
            quantity,
            price,
            discount,
            status,
            user_id: req.user._id,
            charity_id,
            category_id,
            image: imageUpload
        });

        return res.status(201).json({
            status: "Success",
            message: "Product created successfully.",
            data: product
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;

        if (req.user.role === "admin") {
            const product = await Product.findOne({ _id: id });
            if (!product) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Product not found"
                });
            }

            if (product.user_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    status: "Failed",
                    message: "Not authorized"
                });
            }

            const {
                title,
                short_description,
                long_description,
                quantity,
                price,
                discount,
                status,
                image,
                category_id,
                charity_id
            } = req.body;

            const updated_product = await Product.updateOne({ _id: id },
                {
                    $set: {
                        title,
                        short_description,
                        long_description,
                        quantity,
                        price,
                        discount,
                        status,
                        image,
                        category_id,
                        charity_id
                    }
                }
            );

            return res.status(201).json({
                status: "success",
                message: "Product updated successfully",
                data: updated_product
            });

        } else if (req.user.role === "super_admin") {
            const product = await Product.findOne({ _id: id });
            if (!product) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Product not found"
                });
            }

            const {
                title,
                short_description,
                long_description,
                quantity,
                price,
                discount,
                status,
                image,
                category_id,
                charity_id
            } = req.body;

            const updated_product = await Product.updateOne(
                { _id: id },
                {
                    $set: {
                        title,
                        short_description,
                        long_description,
                        quantity,
                        price,
                        discount,
                        status,
                        image,
                        category_id,
                        charity_id
                    }
                }
            );

            return res.status(201).json({
                status: "success",
                message: "Product updated successfully",
                data: updated_product
            });

        } else {
            return res.status(403).json({
                status: "Failed",
                message: "Not authorized"
            });
        }

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function updateProductStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                status: "Failed",
                message: "Product not found"
            });
        }

        if (
            req.user.role === "super_admin" ||
            (req.user.role === "admin" && product.user_id.toString() === req.user._id.toString())
        ) {
            if (!status) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Please provide a status to update"
                });
            }

            const updatedProduct = await Product.updateOne(
                { _id: id },
                { $set: { status } }
            );

            return res.status(200).json({
                status: "success",
                message: "Product status updated successfully",
                data: updatedProduct
            });
        } else {
            return res.status(403).json({
                status: "Failed",
                message: "Not authorized"
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function getAllProducts(req, res) {
    try {
        const data = await Product.find()
        return res.status(200).json({
            status: "success",
            message: "Here is all the products",
            data: data
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}

async function getProductsByCharityIdForAdmin(req, res) {
    try {
        const charity_id = req.params.id;

        if (req.user.role !== "admin" && req.user.role !== "super_admin") {
            return res.status(403).json({
                status: "Failed",
                message: "Only admin or super_admin can access this resource",
            });
        }
        if (req.user.role === "admin") {
            const charity = await Charity.findOne({ _id: charity_id, user_id: req.user._id });

            if (!charity) {
                return res.status(403).json({
                    status: "Failed",
                    message: "You can only access products from your own charities",
                });
            }
        }

        const products = await Product.find({ charity_id: charity_id });

        if (!products || products.length === 0) {
            return res.status(404).json({
                status: "Failed",
                message: "No products found for this charity",
            });
        }

        return res.status(200).json({
            status: "success",
            count: products.length,
            data: products,
        });
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message,
        });
    }
}

async function getAllProductsByCharityId(req, res) {
    try {
        const  charity_id  = req.params.id
        const charity = await Charity.find({ _id: charity_id});

        if (!charity) {
            return res.status(403).json({
                status: "Failed",
                message: "Charity not found",
            });
        }
        const products = await Product.find({ charity_id: charity_id });
        console.log(charity_id);
        

          if (!products || products.length === 0) {
            return res.status(404).json({
                status: "Failed",
                message: "No products found for this charity",
            });
        }

        return res.status(200).json({
            status: "success",
            count: products.length,
            data: products,
        });

    }catch(err){
        return res.status(500).json({
            status:"Failed",
            message:err.message
        })
    }
    
}

async function getAllProductsByCategoryId(req, res) {
    try {
        const  category_id  = req.params.id
        const category = await Charity.find({ _id: category_id});

        if (!category) {
            return res.status(403).json({
                status: "Failed",
                message: "Category not found",
            });
        }
        const products = await Product.find({ category_id: category_id });

          if (!products || products.length === 0) {
            return res.status(404).json({
                status: "Failed",
                message: "No products found for this category",
            });
        }

        return res.status(200).json({
            status: "success",
            count: products.length,
            data: products,
        });

    }catch(err){
        return res.status(500).json({
            status:"Failed",
            message:err.message
        })
    }
    
}

async function getProductById(req,res) {
    try{
        const {id } = req.params
        const product = await Product.findOne({_id:id})
        if(!product){
            return res.status(404).json({
                status:"Failed",
                message:"Product not found"
            })
        }
        return res.status(200).json({
            status:"Success",
            data:product
        })
    }catch(err){
        return res.status(500).json({
            status:"Failed",
            message:err.message
        })
    }
    
}

module.exports = { createProduct, updateProduct, updateProductStatus, getAllProducts,
     getProductsByCharityIdForAdmin,getAllProductsByCharityId, getAllProductsByCategoryId, getProductById };
