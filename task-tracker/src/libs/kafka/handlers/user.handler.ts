export const userHandler = async (userService, message) => {
  switch (message.key.toString()) {
    case 'UserCreated':
      return await userService.create(JSON.parse(message.value.toString()));
    case 'UserUpdated':
      return await userService.update(JSON.parse(message.value.toString()));
    case 'UserDeleted':
      return await userService.delete(message.value.toString());
    default:
      return;
  }
};
