//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//const items = ["Buy Food", "Cook Food", "Eat Food"];
//  const workItems = [];
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemschema={
  name : String
};

const Item= mongoose.model("Item",itemschema);  

const first = new Item({
  name : "go to gym"
});

const sec = new Item({
  name : "go to sleep"
});

const third = new Item({
  name : "wake up"
})

const mainItem =[first,sec,third];
/*

*/
app.get("/", function(req, res) {

//const day = date.getDate();
  Item.find({},function(err,result){
    //console.log(result);  
    if(result.length===0){
      Item.insertMany(mainItem,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("success");
        }
      })
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems:result});
    }
   
  })
  

});

app.post("/", function(req, res){

  //const item = req.body.newItem;

  /*if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }*/
  const newItem =req.body.newItem;
  const item=new Item({
    name : newItem
  });
  item.save();
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
