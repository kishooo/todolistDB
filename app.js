//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash")

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
const listschema={
  name : String,
  items : [itemschema]
};

const List = mongoose.model("List",listschema);

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
app.post("/delete",function(req,res){
  const itemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today"){
    Item.findByIdAndRemove(itemID,function(err){
      if(!err){
        console.log("succ");
        res.redirect("/");
      }
    });   
  }else{
    List.findOneAndUpdate({name : listName},{$pull : {items : {_id : itemID}}},function(err,foundList){
        if(!err){
          console.log("succ2");
          res.redirect("/" + listName);
        }
      });
  }
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
  const listName =req.body.list;
  const item=new Item({
    name : newItem
  });
  if(listName==="Today"){
    item.save();
    res.render("/");
  }else{
    List.findOne({name : listName},function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
});

app.get("/:Others",function(req,res){
  const listItem=_.capitalize(req.params.Others);
  var f=false;
  /*
  List.find({},function(err,result){
    result.forEach(function(res) {
      if(listItem===res.name){
        //console.log("doesn't exist");
        f=true;
      }
    });
    if(f){
      console.log("exsist");
    }else{
      console.log("doesn't exsist");
    }
    
  })*/
  List.findOne({name : listItem},function(err,foundList){
    if(!err){
      if(!foundList){
        const list =new List({
          name : listItem,
          items : mainItem
        });
        list.save();
        res.redirect("/"+listItem);
      }else{
        //console.log("exist");
        res.render("list",{listTitle:listItem, newListItems:foundList.items})
      }
    }
  })
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
