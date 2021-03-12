import React, { useState } from 'react';
import { FormControl, Container, Button, TextField } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: 50,
      marginBottom: 80,
    },
  })
);

export const AddTodo: React.FC = ({ setTask }) => {
  const [todoText, setTodoText] = useState('');
  const classes = useStyles();

  const handleChange = (e) => setTodoText(e.target.value);
  const createTodo = async (e) => {
    e.preventDefault();
    try {
      const data = {
        description: todoText,
      };
      const response = await axios.post('/api/tasks', data, { timeout: 1000 });
      setTask(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTodoText('');
    }
  };

  return (
    <div>
      <Container maxWidth="sm" className={classes.root}>
        <form onSubmit={createTodo}>
          <FormControl fullWidth={true}>
            <TextField
              label="Task description"
              variant="standard"
              onChange={handleChange}
              required={true}
              value={todoText}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 5 }}
              onClick={createTodo}
            >
              <Add />
              Add
            </Button>
          </FormControl>
        </form>
      </Container>
    </div>
  );
};
