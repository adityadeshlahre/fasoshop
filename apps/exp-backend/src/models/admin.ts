interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  // Add more user details here
}

const admins: Admin[] = [];

export { Admin, admins };
