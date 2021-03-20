import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

// const api = axios.create({
//   baseURL: '/api',
//   responseType: 'json',
//   timeout: 10000,
// });

import { AddTodo } from './Todo/AddTodo';
import { Todo } from './Todo/Todo';

export const TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [task]);

  return (
    <>
      <AddTodo setTask={setTask} />
      {tasks.map((todo) => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </>
  );
};
