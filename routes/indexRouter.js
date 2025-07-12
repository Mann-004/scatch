const express = require("express")
const router = express.Router()
const isLoggedIn = require("../middlewares/isLoggedIn.js")
const productModel = require("../models/products-model.js")
const usersModel = require("../models/users-model.js")


router.get("/", (req, res) => {
  let error = req.flash("error")
  res.render("index", { error, loggedIn: false })

})

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success")
  res.render("shop", { products, success })
})

router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await usersModel.findOne({ email: req.user.email }).populate("cart");

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    res.render("cart", { user });
  } catch (err) {
    console.error("Error loading cart:", err);
    res.status(500).send("Server error");
  }
});


router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;
    const user = await usersModel.findOne({ email: req.user.email });

    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/login");
    }

    // Prevent duplicate cart entries
    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
      req.flash("success", "Product added to cart");
    } else {
      req.flash("info", "Product already in cart");
    }

    res.redirect("/shop");
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Server error");
  }
});




router.get("/logout", isLoggedIn, (req, res) => {
  res.render("shop")
})
router.get("/login", (req, res) => {
  res.render("loginuser")
})




// GET Edit Profile Page
router.get('/editprofile', isLoggedIn, async (req, res) => {
  let user = await usersModel.findOne({ email: req.user.email });
  res.render('edit-account', { user });

});

// // Either define it like this above the POST route:
// function updateUser(email, data) {
//     // Mock implementation or actual DB call
//     return Promise.resolve();
//   }

//   // POST /account/edit
//   router.post('/account/edit', (req, res) => {
//     const { name, email, phone, password } = req.body;

//     updateUser(email, { name, email, phone, password }).then(() => {
//       // Update session (optional)
//       req.user = { ...req.user, name, email, phone };
//       res.redirect('/account/:id');
//     }).catch(err => {
//       console.error(err);
//       res.status(500).send('Something went wrong');
//     });
//   });

router.get('/collections/luggage', isLoggedIn, async (req, res) => {
  res.render('luggage')
})
router.get('/collections/backpacks', isLoggedIn, async (req, res) => {
  res.render('backpacks')
})
router.get('/collections/duffles', isLoggedIn, async (req, res) => {
  res.render('duffles')
})


// // Route: /products/backpacks
// router.get('/products/backpacks', async (req, res) => {
//   try {
//     const backpacks = await productModel.find({ category: 'backpacks' });
//     res.render('category-products', { products: backpacks, title: 'Backpacks' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error loading backpacks');
//   }
// });

// // /products/luggage
// router.get('/products/luggage', async (req, res) => {
//   const luggage = await productModel.find({ category: 'luggage' });
//   res.render('category-products', { products: luggage, title: 'Luggage' });
// });

// router.get('/products/duffles', async (req, res) => {
//   const luggage = await productModel.find({ category: 'duffles' });
//   res.render('category-products', { products: duffles, title: 'Duffles' });
// });



// GET /products/:category - show products by category
router.get('/products/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const allowedCategories = ['backpacks', 'luggage', 'duffles'];
    if (!allowedCategories.includes(category)) {
      return res.status(404).send('Category not found');
    }

    const products = await productModel.find({ category });

    // Capitalize the category name for display (e.g., "Duffles")
    const title = category.charAt(0).toUpperCase() + category.slice(1);

    res.render('category-products', { products, title });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;








module.exports = router


