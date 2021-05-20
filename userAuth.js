const router = require("express").Router();
const { MongoClient, ObjectID } = require("mongodb");
const bcrypt = require("bcrypt");

const dbUrl = process.env.DB_URL;

router.post("/register", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    let data = await db.collection("users").findOne({ email: req.body.email });
    if (!data) {
      //   console.log(data);
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
      console.log(req.body);
      await db.collection("users").insertOne(req.body);
      res.status(200).json({
        message: "User Registered",
      });
    } else {
      res.status(404).json({
        message: "User already registered",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

// router.get("/login", async (req, res) => {
//   try {
//     let client = mongoClient.connect(dbUrl);
//     let db = client.db("node-task");
//     let data = await db.collection("users").findOne({ mail: req.body.mail });
//     if (data) {
//     } else {
//       res.status(400).json({
//         message: "User not registered",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
