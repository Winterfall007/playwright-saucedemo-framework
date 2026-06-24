export const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  zip: '12345'
};

export interface LoginUser {
  username: string;
  password: string;
};

export const standardUser: LoginUser = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const users = {

  standard: {
    username: 'standard_user',
    password: 'secret_sauce'
  },

  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  }
};

export const invalidUsers = [
  {
    name: 'Missing first name',
    data: { firstName: '', lastName: 'Doe', zip: '12345' }
  },
  {
    name: 'Missing last name',
    data: { firstName: 'John', lastName: '', zip: '12345' }
  },
  {
    name: 'Missing zip',
    data: { firstName: 'John', lastName: 'Doe', zip: '' }
  },
];