const express = require('express');
const router = express.Router();
const {registerCustomer,loginCustomer} = require("../controllers/authcontrollers");

//----REGISTERATION ROUTE
router.post("/register", registerCustomer);
//----LOGIN ROUTE
router.post("/login", loginCustomer);




module.exports = router;