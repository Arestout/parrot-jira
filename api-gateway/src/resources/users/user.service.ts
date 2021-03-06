import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { IUserRepository } from './interfaces/userRepository.interface';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { createdUserSchema, updatedUserSchema, deletedUserSchema } from './../../libs/kafka/schemas/user.schema';
import { USER_TOPIC } from './../../config/index';
export class UserService {
  protected userRepository: IUserRepository;
  protected kafkaProducer: IKafkaProducer;

  constructor(repository: IUserRepository, kafkaProducer: IKafkaProducer) {
    this.userRepository = repository;
    this.kafkaProducer = kafkaProducer;
  }

  public async findAllUser(): Promise<UserDto[]> {
    const allUser: UserDto[] = await this.userRepository.all();

    return allUser;
  }

  public async findUserById(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.find(userId);

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<UserDto> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createUserData: UserDto = await this.userRepository.create({ ...userData, password: hashedPassword });

      const encodedMessage = await this.kafkaProducer.encode(createdUserSchema, createUserData);
      const event = {
        key: 'UserCreated',
        value: encodedMessage,
        headers: {
          event_id: uuidv4(),
          event_version: '1',
          event_name: 'UserCreated',
          event_time: Date.now().toString(),
          producer: 'api-gateway',
        },
      };

      await this.kafkaProducer.sendMessage(USER_TOPIC, [event]);

      return createUserData;
    } catch (error) {
      throw error;
    }
  }

  public async updateUser(userId: string, userData: UserDto): Promise<UserDto> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await this.userRepository.update(userId, { ...userData, password: hashedPassword });

      const updateUser: UserDto = await this.userRepository.find(userId);

      const encodedMessage = await this.kafkaProducer.encode(updatedUserSchema, updateUser);
      const event = {
        key: 'UserUpdated',
        value: encodedMessage,
        headers: {
          event_id: uuidv4(),
          event_version: '1',
          event_name: 'UserUpdated',
          event_time: Date.now().toString(),
          producer: 'api-gateway',
        },
      };
      await this.kafkaProducer.sendMessage(USER_TOPIC, [event]);

      return updateUser;
    } catch (error) {
      throw error;
    }
  }

  public async deleteUserData(userId: string): Promise<UserDto> {
    const deletedUser: UserDto = await this.userRepository.delete(userId);

    const encodedMessage = await this.kafkaProducer.encode(deletedUserSchema, { public_id: deletedUser.public_id });
    const event = {
      key: 'UserDeleted',
      value: encodedMessage,
      headers: {
        event_id: uuidv4(),
        event_version: '1',
        event_name: 'UserDeleted',
        event_time: Date.now().toString(),
        producer: 'api-gateway',
      },
    };
    await this.kafkaProducer.sendMessage(USER_TOPIC, [event]);

    return deletedUser;
  }
}
