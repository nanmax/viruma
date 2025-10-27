export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  created_at: Date;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}
