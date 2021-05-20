const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.json());

const dbUrl = process.env.DB_URL;
const mongoClient = mongodb.MongoClient;
const objectId = mongodb.ObjectID;

let port = process.env.PORT || 3000;

app.get("/students", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    let data = await db.collection("students").find().toArray();
    // console.log(data);
    res.status(200).json({
      message: "Students data is here",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "No Data Found",
    });
  }
});

app.post("/students-create", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    let data = await db
      .collection("students")
      .find({ name: req.body.name })
      .toArray();

    if (data.length === 0) {
      console.log(data.length);
      await db.collection("students").insertOne(req.body);
      res.status(200).json({
        message: "Student data added successfully",
      });
    } else {
      console.log("Name already exists");
      res.status(200).json({
        message: "Record already exists in the given name. Please recheck!",
      });
    }
    client.close();
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Data cannot be created",
    });
  }
});

app.put("/students-update/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    await db
      .collection("students")
      .findOneAndUpdate({ _id: objectId(req.params.id) }, { $set: req.body });
    res.status(200).json({
      message: "Student updated succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Could not update record",
    });
  }
});

app.delete("/students-delete/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    await db.collection("students").deleteOne({ _id: objectId(req.params.id) });
    res.status(200).json({
      message: "Student deleted succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Could not delete record",
    });
  }
});

//mentor
app.get("/mentors", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    let data = await db.collection("mentors").find().toArray();
    res.status(200).json({
      message: "mentors data is here",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "No Data Found",
    });
  }
});

app.post("/mentors-create", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    let data = await db
      .collection("mentors")
      .find({ name: req.body.name })
      .toArray();
    console.log(data);
    if (data.length === 0) {
      await db.collection("mentors").insertOne(req.body);
      res.status(200).json({
        message: "Mentor data added successfully",
      });
    } else {
      console.log("Name already exists");
      res.status(201).json({
        message: "Record already exists in the given name. Please recheck!",
      });
      client.close();
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({
      message: "Data cannot be created",
    });
  }
});

app.put("/mentors-update/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    await db
      .collection("mentors")
      .findOneAndUpdate({ _id: objectId(req.params.id) }, { $set: req.body });
    res.status(200).json({
      message: "Mentor updated succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Could not update record",
    });
  }
});

app.delete("/mentors-delete/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");
    await db.collection("mentors").deleteOne({ _id: objectId(req.params.id) });
    res.status(200).json({
      message: "Mentor deleted succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Could not delete record",
    });
  }
});

app.put("/mentor-students/:m_id/:s_id", async (req, res) => {
  try {
    let client = await mongoClient.connect(dbUrl);
    let db = client.db("node-task");

    // await db
    //   .collection("mentors")
    //   .findOneAndUpdate(
    //     { _id: objectId(req.params.m_id) },
    //     { $set: { $push: { students: req.params.s_id } } }
    //   );
    let student = await db
      .collection("students")
      .find({ _id: objectId(req.params.s_id) })
      .toArray();

    console.log(student);
    if (student[0].mentor === "") {
      await db
        .collection("students")
        .findOneAndUpdate(
          { _id: objectId(req.params.s_id) },
          { $set: { mentor: req.params.m_id } }
        );
      res.status(200).json({
        message: "Mapping updated successfully",
      });
    } else {
      res.status(201).json({
        message: "Cannont assign more than one mentor to a student",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).status("Sorry, Mapping cannot be done");
  }
});

app.listen(port);
