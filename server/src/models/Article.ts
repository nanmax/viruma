import pool from "../config/database";
import { Article } from "../types";

export class ArticleModel {
  static async createArticle(
    article: Omit<Article, "id" | "created_at" | "updated_at">
  ): Promise<Article> {
    const { title, content, author_id } = article;
    const result = await pool.query(
      "INSERT INTO articles (title, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author_id]
    );
    return result.rows[0];
  }

  static async getArticleById(id: number): Promise<Article | null> {
    const result = await pool.query("SELECT * FROM articles WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  static async getAllArticles(): Promise<Article[]> {
    const result = await pool.query("SELECT * FROM articles");
    return result.rows;
  }

  static async updateArticle(
    id: number,
    article: Partial<Omit<Article, "id" | "created_at" | "updated_at">>
  ): Promise<Article | null> {
    const fields = [];
    const values = [];
    let index = 1;
    for (const key in article) {
      fields.push(`${key} = $${index}`);
      values.push((article as any)[key]);
      index++;
    }
    values.push(id);

    const result = await pool.query(
      `UPDATE articles SET ${fields.join(
        ", "
      )}, updated_at = NOW() WHERE id = $${index} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  static async deleteArticle(id: number): Promise<boolean> {
    const result = await pool.query("DELETE FROM articles WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
