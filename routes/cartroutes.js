const express = require('express');
const router = express.Router();

const {protect} = require('../middleware/authmiddleware');

// Cart routes(customer routes)
//--when user add a product in a cart by clicking(Add to Cart)button

router.post("/",additem);

//--When user opens the cart by clicking Cart icon then list of products appear 

router.get("/",allitems);


//--When user add a product or if user removes it it updates the quantity of the product in backend 
//--using (+) or (-) symbols
router.put("/",updateitem);
// DELETE item from this cart when user removes or delete item from cart 
router.delete("/",delitem);












module.exports = router;
