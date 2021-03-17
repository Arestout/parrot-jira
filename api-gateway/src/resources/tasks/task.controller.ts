import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

const taskApi = axios.create({
  baseURL: `http://api/tasks`,
});

export class TaskController {
  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tasks = await taskApi.get('/', {
        headers: {
          Authorization: req.cookies.Authorization,
        },
      });

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const task = await taskApi.get(`/${id}`, {
        headers: {
          Authorization: req.cookies.Authorization,
        },
      });

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const task = await taskApi.post(
        '/',
        {
          data: body,
        },
        {
          headers: {
            Authorization: req.cookies.Authorization,
          },
        },
      );

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const task = await taskApi.put(
        '/',
        {
          data: body,
        },
        {
          headers: {
            Authorization: req.cookies.Authorization,
          },
        },
      );

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}
