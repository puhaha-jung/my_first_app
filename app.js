var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.on("open", function(){
  console.log("DB Connected!");
});

db.once("error", function(){
  console.log("DB Error: " , err);
});

var dataSchema = mongoose.Schema({
  name:String,
  count:Number
});

var Data = mongoose.model('data', dataSchema);
Data.findOne({name:"myData"}, function(err, data){
  if(err) return console.log("Data Error: " , err);
  if(!data){
    Data.create({name:"myData", count:0},function(err, data){
      if(err) return console.log("Data Error: " , err);
      console.log("Counter initialized : ", data);
    });
  }
});

//var data = {count:0};
app.set("view engine", 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/public'));
//console.log(__dirname);
//app.get('/', function(req,res){
//  res.send('Hello World');
//});


app.get('/', function(req,res){
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return console.log("Data Error:", err);
    data.count++;
    data.save(function(err){
      if(err) return console.log("Data Error: ", err);
      res.render('my_first_ejs', data);
    });
  });
});

app.get('/reset', function(req,res){
  setCounter(res,0);
});
app.get('/set/count', function(req,res){
  if(req.query.count) setCounter(res,req.query.count);
  else getCounter(res);
});

app.get('/set/:num', function(req,res){
  if(req.params.num) setCounter(res, req.params.num);
  else getCounter(res);
});

function setCounter(res,num){
  console.log("Set Counter");
  Data.findOne({name:"myData"}, function(err,data){
    if(err) return console.log("Data Error: ", err);
    data.count = num;
    data.save(function(err){
      if(err) return console.log("Data Error: ", err);
      res.render('my_first_ejs', data);
    });
  });
}
function getCounter(res){
  console.log("Get Counter");
  Data.findOne({name:"myData"}, function(err, data){
    if(err) return writelog("Data Error", err);// console.log("Data Error: ", err);
    res.render('my_first_ejs', data);
  });
}

function writelog(msg, err){
  console.log(msg, err);
}
app.listen(3000, function(){
  console.log('Server On');
  writelog('Test', '');
});
