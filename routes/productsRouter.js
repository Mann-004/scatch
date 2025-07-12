
const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config.js");
const productModel = require("../models/products-model.js");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, discount, category } = req.body;

    if (!category) {
      return res.status(400).send("Category is required.");
    }

    const product = await productModel.create({
     image: req.file?.buffer || null,
      name,
      price, 
      discount,
      category, // ✅ Store category
    });

    req.flash("success", "Product created successfully");
    res.redirect("/shop");
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
