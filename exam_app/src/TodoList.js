import React, {useState, useCallback,useRef, useEffect} from 'react';
// import from './TodoList/styled/todolist.css';
import {createSet,createAdd,createRemove,createToggle} from './Redux/actions.js';
import TodoListWrapper from './TodoList/styled/TodoListWrapper.js';


let isId=Date.now();
const Control=(props)=>{
  const { dispatch} = props;
  const inputRef = useRef();
  const onSubmit=(e)=>{
    e.preventDefault();
    const newtext=inputRef.current.value.trim();
    if(newtext.length === 0){
      return;
    }else{
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
const TodoItem=(props)=>{
  const {todo:{id,text,complete},dispatch}= props;
  const onChange=()=>{
    dispatch(createToggle(id))
  };
  const onRemove=()=>{
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
const Todos=(props)=>{
  const {todos,dispatch}=props;
  return (
    <ul>
      {
        todos.map(todo =>{
          return (
          <TodoItem
            key={todo.id}
            todo={todo}
            dispatch={dispatch}
          />);
        })
      }
    </ul>
  );
}

const LS_KEY='_todos_'

const TodoList=()=>{
  const [todos,setTodos]=useState([]);
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
    dispatch(createSet(todos))
   },[]);

  useEffect(()=>{
    localStorage.setItem(LS_KEY,JSON.stringify(todos));
  },[todos]);
  
  return (
    <TodoListWrapper >
      <Control dispatch={dispatch}/>
      <Todos dispatch={dispatch}  todos={todos} />
    </TodoListWrapper>
  );
}

export default TodoList;
