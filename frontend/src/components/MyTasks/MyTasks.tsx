import React, { useState, useEffect } from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { ITask } from 'src/redux/auth';
import { Task } from '../TaskTracker/Task';

export const MyTasks: React.FC = () => {
  const {
    auth: { user, access_token, userTasks },
    dispatchFetchUserTasks,
  } = useAuth();

  useEffect(() => {
    if (user && user.role === 'developer') {
      dispatchFetchUserTasks({ access_token, userId: user.public_id });
    }
  }, []);

  return (
    <>
      {user &&
        user.role === 'developer' &&
        userTasks.map((task: ITask) => <Task task={task} key={task.id} />)}
    </>
  );
};
