const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('../models/User');
const Tweet = require('../models/Tweet');

const NUM_SEED_USERS = 10;
const NUM_SEED_TWEETS = 30;

// Create users
const users = [];

users.push(
  new User ({
    username: 'demo-user',
    email: 'demo-user@appacademy.io',
    hashedPassword: bcrypt.hashSync('starwars', 10)
  })
)

for (let i = 1; i < NUM_SEED_USERS; i++) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  users.push(
    new User ({
      username: faker.internet.userName({ firstName, lastName }),
      email: faker.internet.email({ firstName, lastName }),
      hashedPassword: bcrypt.hashSync(faker.internet.password(), 10)
    })
  )
}
  
// Create tweets
const tweets = [];

for (let i = 0; i < NUM_SEED_TWEETS; i++) {
  tweets.push(
    new Tweet ({
      text: faker.hacker.phrase(),
      author: users[Math.floor(Math.random() * NUM_SEED_USERS)]._id
    })
  )
}


// Connect to database and insert users and tweets
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');
    insertSeeds();
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });

// Reset and seed db
const insertSeeds = () => {
  console.log("Resetting db and seeding users and tweets...");

  User.collection.drop()
    .then(() => Tweet.collection.drop())
    .then(() => User.insertMany(users))
    .then(() => Tweet.insertMany(tweets))
    .then(() => {
      console.log("Done!");
      mongoose.disconnect();
    })
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    });
}
  

