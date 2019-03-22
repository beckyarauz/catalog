const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '../.env')
})

// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

require('../configs/database')

let users = [
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "Laca Laca",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "lacalaca",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Delicious Mexican Food!",
    "category": "food",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Nestor",
    "lastName": "Ramirez",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "My Food Parlor",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "foodparlor",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "All food you can imagine",
    "category": "food",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Jason",
    "lastName": "Harold",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "Olocuilta",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "olocuilta",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Las mejores pupusas del mundo",
    "category": "food",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Carolina",
    "lastName": "Arauz",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "MAC Makeup",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "macmakeup",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "The best make up in the world",
    "category": "food",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Stef",
    "lastName": "Johansen",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "She In",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "shein",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Trendy clothes at reasonable price",
    "category": "clothing",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Nicky",
    "lastName": "Marven",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "Gifts4U",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "gifts4u",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Hand made soap for your loved ones",
    "category": "gifts",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Thomas",
    "lastName": "Appleford",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "Feet Deluxe",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "shoemaker",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Handmade customizable shoes",
    "category": "clothing",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Marlen",
    "lastName": "Brad",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
  {
    "role": "SELLER",
    "clients": [],
    "products": [],
    "company": "Classic Tattoo",
    "geolocation": {
      "latitude": 52.50957057772544,
      "longitude": 13.372810361382918
    },
    "address": "Some Street, 10405, San Salvador, El Salvador",
    "username": "classictattoo",
    "password": "123",
    "created_at": "2019-03-18T13:19:57.440Z",
    "updated_at": "2019-03-22T15:00:05.445Z",
    "__v": 0,
    "about": "Beautifuly designed tattoos",
    "category": "tattoo",
    "email": "caro.arauz@hotmail.com",
    "firstName": "Fabiola",
    "lastName": "Lacayo",
    "logoUrl": "",
    "phone": "( 49) 0000-0005"
  },
]

User.create(users).then(usersCreated => {
      console.log(`${usersCreated.length} users created with the following id:`);
      console.log(usersCreated.map(u => u._id))}).catch(err => {
            mongoose.disconnect()
            throw err
          });

// User.deleteMany()
//   .then(() => {
//     return User.create(users)
//   })
//   .then(usersCreated => {
//     console.log(`${usersCreated.length} users created with the following id:`);
//     console.log(usersCreated.map(u => u._id));
//   })
//   .then(() => {
//     // Close properly the connection to Mongoose
//     mongoose.disconnect()
//   })
//   .catch(err => {
//     mongoose.disconnect()
//     throw err
//   })