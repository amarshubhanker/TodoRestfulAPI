console.log("is script file running");
const RESPONSE_DONE=4;
const STATUS_OK=200;
const TODOS_LIST_ID="todos_list_div";
const TODOS_DELETED_LIST_ID="deleted_todos";
const TODOS_COMPLETED_LIST_ID="completed_todos";
const NEW_TODO_INPUT_ID="new_todo_input";
window.onload=getTodoAJAX();
//window.onload=
function addTodoElements(a_id,c_id,d_id,todos_data_json) {
    var todos=JSON.parse(todos_data_json);
    var parent_A=document.getElementById(a_id);
    var parent_C=document.getElementById(c_id);
    var parent_D=document.getElementById(d_id);

    //parent.innerHTML = todos_data_json;
    parent_A.innerHTML="";
    parent_C.innerHTML="";
   parent_D.innerHTML="";

    if(parent_A||parent_D||parent_C) {
        Object.keys(todos).forEach(
            function (key) {

                if(todos[key].status=="ACTIVE")
                {
                    var todo_element=document.createElement("div");
                    //var title=document.createElement("div");
                    //title.innerText=todos[key].title;
                    var title=document.createTextNode(todos[key].title);
                    todo_element.setAttribute("data-id",key);
                    todo_element.setAttribute("class","todoStatus"+todos[key].status);

                        var checkbox=document.createElement("INPUT");
                        checkbox.setAttribute("onchange","completeTodoAJAX("+key+")");
                        checkbox.setAttribute("type","checkbox");
                        checkbox.setAttribute("class","breathHorizontal");
                        todo_element.appendChild(checkbox);
                        todo_element.appendChild(title);
                        var deleted_button=document.createElement("button");
                        deleted_button.innerText="x";
                        deleted_button.setAttribute("onclick","deleteTodoAJAX("+key+")");
                        deleted_button.setAttribute("class","breathHorizontal");
                        todo_element.appendChild(deleted_button);
                        parent_A.appendChild(todo_element);
                }
                if(todos[key].status=="COMPLETE")
                {
                    var todo_element=document.createElement("div");
                    //var title=document.createElement("div");
                    //title.innerText=todos[key].title;
                    var title=document.createTextNode(todos[key].title);
                    todo_element.setAttribute("data-id",key);
                    todo_element.setAttribute("class","todoStatus"+todos[key].status);
                    var checkbox=document.createElement("INPUT");
                    checkbox.setAttribute("onchange","ActiveTodoAJAX("+key+")");
                    checkbox.setAttribute("type","checkbox");
                    checkbox.setAttribute("class","breathHorizontal");
                    todo_element.appendChild(checkbox);
                    todo_element.appendChild(title);
                    var deleted_button=document.createElement("button");
                    deleted_button.innerText="x";
                    deleted_button.setAttribute("onclick","deleteTodoAJAX("+key+")");
                    deleted_button.setAttribute("class","breathHorizontal");
                    todo_element.appendChild(deleted_button);
                    parent_C.appendChild(todo_element);
                }
                if(todos[key].status=="DELETED")
                {
                    var title=document.createElement("div");
                    title.innerText=todos[key].title;
                    title.setAttribute("class","breathVertical")
                    parent_D.appendChild(title);
                }

            }
        )
    }
}
function deleteTodoAJAX(id) {
    var xhr=new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    //var data="todo_status=COMPLETE";
    xhr.onreadystatechange = function () {
        if(xhr.readyState==RESPONSE_DONE) {
            if(xhr.status==STATUS_OK) {
                addTodoElements(TODOS_LIST_ID,TODOS_COMPLETED_LIST_ID,TODOS_DELETED_LIST_ID,xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}
function ActiveTodoAJAX(id) {
    var xhr=new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var data="todo_status=ACTIVE";

    console.log(data);
    xhr.onreadystatechange = function () {
        if(xhr.readyState==RESPONSE_DONE) {
            if(xhr.status==STATUS_OK) {
                addTodoElements(TODOS_LIST_ID,TODOS_COMPLETED_LIST_ID ,TODOS_DELETED_LIST_ID   ,xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function completeTodoAJAX(id) {
    var xhr=new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id,true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        var data="todo_status=COMPLETE";

    console.log(data);
    xhr.onreadystatechange = function () {
        if(xhr.readyState==RESPONSE_DONE) {
            if(xhr.status==STATUS_OK) {
                addTodoElements(TODOS_LIST_ID,TODOS_COMPLETED_LIST_ID ,TODOS_DELETED_LIST_ID   ,xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}
function getTodoAJAX()
{
  console.log("loading");
  var xhr=new  XMLHttpRequest();
  xhr.open("GET","/api/todos",true);
  xhr.onreadystatechange=function () {
      if(xhr.readyState==RESPONSE_DONE) {
          if(xhr.status==STATUS_OK) {
              console.log(xhr.responseText);
              addTodoElements(TODOS_LIST_ID,TODOS_COMPLETED_LIST_ID,TODOS_DELETED_LIST_ID,xhr.responseText);
          }
      }
  }
    xhr.send(data=null);
}

function addTodoAJAX() {
    var title=document.getElementById(NEW_TODO_INPUT_ID).value;
    console.log(title);
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/api/todos",true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var data = "todo_title=" + encodeURI(title);
    xhr.onreadystatechange = function () {
        if(xhr.readyState==RESPONSE_DONE) {
            if(xhr.status==STATUS_OK) {
                document.getElementById("new_todo_input").value="";
                addTodoElements(TODOS_LIST_ID,TODOS_COMPLETED_LIST_ID,TODOS_DELETED_LIST_ID,xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}
