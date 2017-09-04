var express=require("express");
var app=express();


var todo_db=require("./seed.js");
console.log(todo_db);

var body_parser=require("body-parser");

app.use("/",function (req,res,next) {
    console.log("request");
    console.log(req.url);
    console.log(req.method);
    next();
})

app.use("/",express.static(__dirname+"/public"));

//what all interactions?
//1.get all todo
//2.add a todo
// 3.complete a todo
//4. delete a todo

//http://localhost:4000?todos/GET
app.use("/",body_parser.urlencoded({extended:false}));

app.get("/api/todos",function (req,res) {
    res.json(todo_db.todos);

})
app.get("/api/todos/Active",function (req,res) {

    for(var i=1;i<todo_db.next_todo_id;i++) {
        todo_db.todos[i].status = "ACTIVE";
    }
    res.json(todo_db.todos);
})
app.get("/api/todos/Complete",function (req,res) {
    for(var i=1;i<todo_db.next_todo_id;i++) {
        todo_db.todos[i].status = "COMPLETE";
    }
    res.json(todo_db.todos);
})
app.get("/api/todos/Delete",function (req,res) {
    for(var i=1;i<todo_db.next_todo_id;i++) {
        todo_db.todos[i].status = "DELETED";
    }
    res.json(todo_db.todos);
})
//http://localhost:4000?todos/:id DELETE

app.delete("/api/todos/:id",function (req,res) {

    //todos_db
    //todos_db.data={id:{title:status:},id:title:status:}
    var del_id=req.params.id;
    var todo=todo_db.todos[del_id];
    //if this todo does'nt exist

    if(!todo)
    {
     res.status(400).json({error:"todo does'nt exist"});
    }
    else
    {
        todo.status=todo_db.StatusENUMS.DELETED;
        res.json(todo_db.todos);
    }
    //if todo exists
    //delete
    //send appropriate response to customer
});

app.post("/api/todos",function (req,res) {
    var title=req.body.todo_title;

    if(!title || title==""||title.trim()=="")
        {
            res.status(400).json({error:"todo title can't be empty"});
        }
        else
    {
        var new_todo_object={
            title:req.body.todo_title,
        status:todo_db.StatusENUMS.ACTIVE
    }

    todo_db.todos[todo_db.next_todo_id++]=new_todo_object;
        res.json(todo_db.todos);
    }
})

//http://localhost:4000?todos POST
//http://localhost:4000?todos/:id PUT

app.put("/api/todos/:id",function (req,res) {
    var mod_id=req.params.id;
    var todo=todo_db.todos[mod_id];
    if(!todo) {
        res.status(400).json({error:"todo can't modify that doesn't exist"});
    }
    else{
        var todo_title=req.body.todo_title;
        if(todo_title&& todo_title!="" && todo_title.trim()!="") {
            todo.title=todo_title;
        }
        var todo_status=req.body.todo_status;
        if(todo_status&&(todo_status==todo_db.StatusENUMS.ACTIVE ||
                todo_status==todo_db.StatusENUMS.COMPLETE) ) {
            todo.status=todo_status;
        }
        res.json(todo_db.todos);
    }
});
app.listen(4000);