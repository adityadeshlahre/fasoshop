interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  // Add more user details here
}

const users: User[] = [];

export { User, users };
