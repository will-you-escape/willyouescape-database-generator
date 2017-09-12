const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const csv = require('csvtojson');

const inputFilePath='<path to csv file>'
const mongoUrl = 'mongodb://localhost:27017/myproject';
const roomsCollection = "wye-roomstest";


const handler = function () {

  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    insertDocuments(db, function(results) {
      console.log(results);
      db.close();
    });
  });

};

const test = function () {
  MongoClient.connect(mongoUrl, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    findDocuments(db, function(results) {
      console.log(results);
      db.close();
    });
  });
}

const insertDocuments = function(db, callback) {
  const collection = db.collection(roomsCollection);
  let rooms = [];
  console.log("Reads csv file.")
  csv()
  .fromFile("./data/roomsdb-v1.csv")
  .on('json',(jsonObj)=>{
    // combine csv header row and csv line to a json object 
    // jsonObj.a ==> 1 or 4 
    //console.log(jsonObj);
    rooms.push(jsonObj);
  })
  .on('done',(error)=>{
    console.log('Ends reading csv file. Now inserting in MongoDB');
    collection.insertMany(rooms, function(err, result) {
      assert.equal(err, null);
      assert.equal(rooms.length, result.result.n);
      assert.equal(rooms.length, result.ops.length);
      callback(result);
    });

  })
};

const findDocuments = function(db, callback) {
  // Get the documents collection 
  const collection = db.collection(roomsCollection);
  // Find some documents 
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log(docs.length);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
}

//handler();
test();
