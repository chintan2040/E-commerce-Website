const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

// Home
router.get('/', (req, res) => {
  let error = req.flash('error');
  let success = req.flash('success');
  res.render('index', { error, success, loggedin: false });
});

// Shop
router.get('/shop', isLoggedIn, async (req, res) => {
  const { sort, discountOnly } = req.query;

  let query = {};
  if (discountOnly === 'true') {
    query.discount = { $gt: 0 };
  }

  let sortOption = {};
  if (sort === 'price-asc') sortOption.price = 1;
  else if (sort === 'price-desc') sortOption.price = -1;

  const products = await productModel.find(query).sort(sortOption);
  res.render('shop', { products, success: req.flash('success'), sort, discountOnly });
});


// Add to Cart
router.get('/addtocart/:productid', isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  let existingItem = user.cart.find(
    item => item.product.toString() === req.params.productid
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    user.cart.push({
      product: req.params.productid,
      quantity: 1
    });
  }

  await user.save();
  req.flash('success', 'Product added to cart');
  res.redirect('/shop');
});

// Cart Page
router.get('/cart', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email }).populate('cart.product');
  res.render('cart', { user });
});

// Clear Cart
router.post('/cart/clear', isLoggedIn, async (req, res) => {
  await userModel.findOneAndUpdate({ email: req.user.email }, { $set: { cart: [] } });
  res.redirect('/cart');
});

// Increase Quantity
router.post('/cart/increase/:id', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const cartItem = user.cart.find(c => c.product.toString() === req.params.id);
  if (cartItem) {
    cartItem.quantity += 1;
    await user.save();
  }
  res.redirect('/cart');
});

// Decrease Quantity
router.post('/cart/decrease/:id', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  const cartItem = user.cart.find(c => c.product.toString() === req.params.id);
  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      user.cart = user.cart.filter(c => c.product.toString() !== req.params.id);
    }
    await user.save();
  }
  res.redirect('/cart');
});

module.exports = router;
