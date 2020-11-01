import React, {useState, useCallback,useRef, useEffect} from 'react';
// import from './TodoList/styled/todolist.css';
import {createSet,createAdd,createRemove,createToggle} from './Redux/actions.js';


let isId=Date.now();
function Control(props){
  const { dispatch} = props;
  const inputRef = useRef();
  const onSubmit=(e)=>{
    e.preventDefault();
    const newtext=inputRef.current.value.trim();
    if(newtext.length === 0){
      return;
    }else{
      // addTodo({
      //   id:++isId,
      //   text: newtext,
      //   complete:false
      // });
      // dispatch({
      //   type:'add',
      //   payload:{
      //     id:++isId,
      //     text: newtext,
      //     complete:false 
      //   }
      // })
      dispatch(createAdd({
        id: ++isId,
        text: newtext,
        complete:false}))
      inputRef.current.value = ''
    }
  };
  return (
    <div className="constrol">
      <h1> todos </h1>
      <form onSubmit={onSubmit}>
        <input ref={inputRef} type="text" className="new-todo" placeholder="what to "/>
      </form>
    </div>
  );
}
function TodoItem(props){
  const {todo:{id,text,complete},/*toggleTodo,removeTodo*/dispatch}= props;
  const onChange=()=>{
    // toggleTodo(id);
    // dispatch({type:'toggle',payload:id})
    dispatch(createToggle(id))
  };
  const onRemove=()=>{
    // removeTodo(id);
    // dispatch({type:'remove',payload:id})
    dispatch(createRemove(id))
  };
  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete}/>
      <label className={complete?'completed':''}>{text}</label>
      <button onClick={onRemove}>&#xd7</button>
    </li>
  );
}
function Todos(props){
  const {todos,dispatch}=props;
  return (
    <ul>
      {
        todos.map(todo =>{
          return (
          <TodoItem
            key={todo.id}
            todo={todo}
            // toggleTodo={toggleTodo}
            // removeTodo={removeTodo}
            dispatch={dispatch}
          />);
        })
      }
    </ul>
  );
}

const LS_KEY='_todos_'

function  TodoList(){
  const [todos,setTodos]=useState([]);
  // const addTodo= useCallback((todo)=>{
  //   setTodos(todos=>[...todos,todo]);
  // },[]);
  // const removeTodo=useCallback((id)=>{
  //   setTodos(
  //     todos=>todos.filter(
  //       todo=>{
  //         return todo.id !== id;
  //     }))
  // },[]);
  // const toggleTodo= useCallback((id)=>{
  //   setTodos(todos => todos.map(
  //     todo => {
  //       return todo.id === id 
  //       ? {
  //           ...todo,
  //           complete: !todo.complete
  //       }:todo;
  //     }
  //   ))
  // },[]);
  const dispatch= useCallback((action)=>{
    const {type,payload}=action;
    switch(type){
      case 'set':
        setTodos(payload);
        break;
      case 'add':
          setTodos(todos=>[...todos, payload]);
        break;
      case 'remove':
        setTodos(
          todos=>todos.filter(
            todo=>{
              return todo.id !== payload;
          }))
        break;
      case 'toggle':
            setTodos(todos => todos.map(
              todo => {
                return todo.id === payload
                ?{
                  id:todo.id,//解构语法
                  text:todo.text,
                  complete: !todo.complete
                }:todo;
              }               
              ))
        break;
      default:
    }
  },[]);

  useEffect(()=>{
    const todos=JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    //  setTodos(todos)
    // dispatch({type:'set',payload:todos});
    dispatch(createSet(todos))
   },[]);

  useEffect(()=>{
    localStorage.setItem(LS_KEY,JSON.stringify(todos));
  },[todos]);
  
  return (
    <div className="todo-list">
      {/* <Control addTodo={addTodo}/>
      <Todos removeTodo={removeTodo} toggleTodo={toggleTodo} todos={todos} /> */}
      <Control dispatch={dispatch}/>
      <Todos dispatch={dispatch}  todos={todos} />
    </div>
  );
}

export default TodoList;

