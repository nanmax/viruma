import pool from "../config/database";
import { User } from "../types";

export class UserModel {
  static async createUser(
    user: Omit<User, "id" | "created_at">
  ): Promise<User> {
    const { username, email, password, role } = user;
    const result = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, role]
    );
    return result.rows[0];
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  static async getUserById(id: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  static async getAllUsers(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async deleteUser(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
  }
}
