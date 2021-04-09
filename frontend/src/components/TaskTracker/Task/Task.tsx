import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  ButtonGroup,
  Button,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import { api } from '../../../api';
import { ITask } from 'src/redux/auth';
import { useAuth } from 'src/hooks/useAuth';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    buttonsGrid: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  })
);

type TodoProps = {
  task: ITask;
};

export const Task: React.FC<TodoProps> = ({ task }) => {
  const classes = useStyles();
  const {
    auth: { user, access_token },
    dispatchFetchUserTasks,
  } = useAuth();
  const textDecoration = task.completed ? 'line-through' : '';

  const closeTask = async () => {
    try {
      const data = {
        ...task,
        completed: true,
      };
      await api.put(`/tasks/${task.id}`, data, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      dispatchFetchUserTasks({ access_token, userId: user?.public_id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Card
        className="root"
        variant="outlined"
        style={{ marginTop: 35, background: 'lightgray' }}
      >
        <CardContent className={classes.root}>
          <Grid container spacing={2}>
            <Grid item xs={7} style={{ textDecoration }}>
              <Typography variant="h5" component="h2">
                {task.description}
              </Typography>
            </Grid>
            <Grid item xs={5} className={classes.buttonsGrid}>
              <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical contained primary button group"
                variant="contained"
              >
                <Button disabled={task.completed} onClick={closeTask}>
                  {task.completed ? 'Completed' : 'Complete'}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};
