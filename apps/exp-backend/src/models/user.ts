interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  token: string;
  // Add more user details here
}

const user: User[] = [];

export { User, user };
