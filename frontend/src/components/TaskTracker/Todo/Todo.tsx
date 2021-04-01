import React, { useState } from 'react';
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

export const Todo: React.FC = ({ todo }) => {
  const classes = useStyles();
  const [status, setStatus] = useState(todo.completed);
  const textDecoration = status ? 'line-through' : '';

  const closeTask = async () => {
    try {
      const data = {
        ...todo,
        completed: true,
      };
      const response = await api.put(`/tasks/${todo.id}`, data);
      setStatus(response.data.completed);
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
                {todo.description}
              </Typography>
            </Grid>
            <Grid item xs={5} className={classes.buttonsGrid}>
              <ButtonGroup
                orientation="vertical"
                color="primary"
                aria-label="vertical contained primary button group"
                variant="contained"
              >
                <Button disabled={todo.completed} onClick={closeTask}>
                  {todo.completed ? 'Completed' : 'Complete'}
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};
