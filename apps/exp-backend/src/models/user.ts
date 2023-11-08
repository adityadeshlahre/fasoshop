interface User {
  id: number;
  username: string;
  email: string;
  password: string | undefined;
  // Add more user details here
}

const user: User[] = [];

export { User, user };
