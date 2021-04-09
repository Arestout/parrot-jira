import React, { useState, useEffect } from 'react';

import { AddTask, Task } from 'src/components/TaskTracker';
import { AssignTasks } from 'src/components/TaskTracker/AssignTasks';
import { useAuth } from 'src/hooks/useAuth';
import { ITask } from 'src/redux/auth';

export const TasksDashboard: React.FC = () => {
  const { auth } = useAuth();
  const { user, tasks } = auth;

  return (
    <>
      {user && user.role === 'manager' && <AssignTasks />}
      <AddTask />
      {tasks.map((task: ITask) => (
        <Task task={task} key={task.id} />
      ))}
    </>
  );
};
