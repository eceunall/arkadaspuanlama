const express=require("express");
const app=express();

app.set("view engine","ejs");


app.use("/products/:id",function(req,res){
    res.send("products details" + req.params.id);
});
app.use("/products",function(req,res){
    res.send("products");
});
app.use("/",function(req,res){
    res.send("anasayfa");
});


app.listen(3000,() =>{
    console.log("listening on port 3000");
});