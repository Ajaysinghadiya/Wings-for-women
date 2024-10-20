var jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const jwtSecret = "Hiimyselfarimardansinghpariharji5676"; // Replace with your secret key
const authenticateToken = async (req, res, next) =>{
  try
  {
    const token = req.cookie.token;
    if (!token) return res.status(401).send('Access denied. No token provided.');
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
  } catch{
    req.status(401).send(`here you encountered a error ${error}`);
  }
}

  
  module.exports=authenticateToken;