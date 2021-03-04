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
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) =>
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
        completed: !status,
      };
      const response = await axios.put(`/api/tasks/${todo.id}`, data);
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
                <Button onClick={closeTask}>
                  {status ? 'Re-Open' : 'Close'}
                </Button>
                {/* <Button>Two</Button>
                <Button>Three</Button> */}
              </ButtonGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};
