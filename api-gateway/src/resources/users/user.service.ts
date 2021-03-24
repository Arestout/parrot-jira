import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from 'kafkajs';

import { IUserRepository } from './interfaces/userRepository.interface';
import { CreateUserDto } from './user.dto';
import { UserDto } from './interfaces/user.interface';
import { IKafkaProducer } from '../../libs/kafka/kafka.interface';
import { createdUserSchema, updatedUserSchema, deletedUserSchema } from './../../libs/kafka/schemas/user.schema';
export class UserService {
  protected userRepository: IUserRepository;
  protected kafkaProducer: IKafkaProducer;
  private topic = 'user-topic';

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
    if (!this.kafkaProducer.isReady) {
      await this.kafkaProducer.init();
    }

    const transaction: Transaction = await this.kafkaProducer.getTransaction();

    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const createUserData: UserDto = await this.userRepository.create({ ...userData, password: hashedPassword });

      const encodedMessage = await this.kafkaProducer.encode(createdUserSchema, { event_id: uuidv4(), ...createUserData });
      const event = {
        key: 'UserCreated',
        value: encodedMessage,
      };
      await transaction.send({ topic: this.topic, messages: [event] });
      await transaction.commit();

      return createUserData;
    } catch (error) {
      console.log(error);
      await transaction.abort();
      throw error;
    }
  }

  public async updateUser(userId: string, userData: UserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await this.userRepository.update(userId, { ...userData, password: hashedPassword });

    const updateUser: UserDto = await this.userRepository.find(userId);

    const encodedMessage = await this.kafkaProducer.encode(updatedUserSchema, { event_id: uuidv4(), ...updateUser });
    const event = {
      key: 'UserUpdated',
      value: encodedMessage,
    };
    await this.kafkaProducer.sendMessage(this.topic, [event]);

    return updateUser;
  }

  public async deleteUserData(userId: string): Promise<UserDto> {
    const findUser: UserDto = await this.userRepository.find(userId);

    const deletedUser: UserDto = await this.userRepository.delete(userId);

    const encodedMessage = await this.kafkaProducer.encode(deletedUserSchema, { event_id: uuidv4(), public_id: deletedUser.public_id });
    const event = {
      key: 'UserDeleted',
      value: encodedMessage,
    };
    await this.kafkaProducer.sendMessage(this.topic, [event]);

    return findUser;
  }
}
