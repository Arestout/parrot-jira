import React, { useState, useEffect } from 'react';

import { api } from '../../api';
import { Todo } from '../TaskTracker/Todo/Todo';

export const MyTasks: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const userString = window.localStorage.getItem('user');
  const user = userString && JSON.parse(userString);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/developer/${user.public_id}`);
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user.role === 'developer') {
      fetchTasks();
    }
  }, []);

  console.log(user.role);

  return (
    <>
      {user &&
        user.role === 'developer' &&
        tasks.map((todo) => <Todo todo={todo} key={todo.id} />)}
    </>
  );
};
