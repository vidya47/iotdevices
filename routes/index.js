var express = require('express');
var router = express.Router();
var mongodb     = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dburl = "mongodb://localhost:27017";
var dburltwo = "mongodb://localhost:27017/devicedata";
var dbName = 'devicedata';
const assert = require('assert');

// Use connect method to connect to the server
MongoClient.connect(dburl, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});

/* GET devices listing. */
router.get('/', function(req, res, next) {

  MongoClient.connect(dburltwo, function(err, db) {

    if(err) {  console.log(err); throw err;  }

    data = '';

    db.collection('devices').find().toArray(function(err, docs){

      if(err) throw err;

      res.render('index.jade', {data: docs});

      db.close();

    });

  });

});

//route to insert records
router.post('/add', function(req, res, next) {

  MongoClient.connect(dburltwo, function(err, db) {

    if(err) { throw err;  }

    var collection = db.collection('devices');

    var device = {  device_name: req.body.device_name,  status:req.body.status, model: req.body.model, make: req.body.make, year: req.body.year };

    collection.insert(device, function(err, result) {

    if(err) { throw err; }

      db.close();

      res.redirect('/');

  });

  });

});



//create a route fetchdata
router.get('/fetchdata', function(req, res, next) {

   var id = req.query.id;

   MongoClient.connect(dburltwo, function(err, db) {

    if(err) {  throw err;  }

    db.collection('devices').find({_id: new mongodb.ObjectID(id)}).toArray(function(err, docs){

      if(err) throw err;

      res.send(docs);

      db.close();

    });

  });

});

//create edit route
router.post('/edit', function(req, res, next){

  MongoClient.connect(dburltwo, function(err, db) {

    if(err) { throw err; }

    var collection   = db.collection('devices');

    var device_name = req.body.device_name;

    var status      = req.body.status;

    var model     = req.body.model;

    var make     = req.body.make;

    var year     = req.body.year;

    collection.update({'_id':new mongodb.ObjectID(req.body.id)},
    { $set: {'device_name': device_name, 'status': status, 'model': model, 'make': make, 'year': year } }, function(err, result) {

      if(err) {

        throw err;

      } else {

      db.close();
      res.json({message: device_name + ' data updated successfully! '});
      res.redirect('/');
    }

    });

  });

});

//create delete route
router.get('/delete', function(req, res, next) {

  var id = req.query.id;

  MongoClient.connect(dburltwo, function(err, db) {

    if(err) { throw err;  }

    db.collection('devices', function(err, products) {

      products.deleteOne({_id: new mongodb.ObjectID(id)});

      if (err){

       throw err;

      }else{

         db.close();
          res.redirect('/');

       }

    });

  });

});

module.exports = router;
