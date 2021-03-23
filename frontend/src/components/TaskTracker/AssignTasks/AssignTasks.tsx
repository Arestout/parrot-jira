import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { api } from './../../../api/api';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export const AssignTasks = () => {
  const classes = useStyles();

  const onClick = async () => {
    try {
      const { data } = await api.put('/tasks/assign');
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.root}>
      <Button variant="contained" color="secondary" onClick={onClick}>
        Assign Tasks
      </Button>
    </div>
  );
};
