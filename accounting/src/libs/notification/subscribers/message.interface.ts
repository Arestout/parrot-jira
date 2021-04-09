import { UserDto } from '../../../resources/users/interfaces/user.interface';

export interface INotificationMessage {
  user: UserDto;
  message: string;
}

export interface INotificationJobData {
  user_id: string;
  message: string;
}
