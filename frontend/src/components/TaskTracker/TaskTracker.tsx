import React, { useState, useEffect } from 'react';

import { AddTodo } from './Todo/AddTodo';
import { Todo } from './Todo/Todo';
import { api } from '../../api';
import { AssignTasks } from './AssignTasks/AssignTasks';

export const TaskTracker: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const userString = window.localStorage.getItem('user');
  const user = JSON.parse(userString);

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
      {user.role === 'manager' && <AssignTasks />}
      <AddTodo setTask={setTask} />
      {tasks.map((todo) => (
        <Todo todo={todo} key={todo.id} />
      ))}
    </>
  );
};
