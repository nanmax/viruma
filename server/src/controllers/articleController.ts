import {Request,Response} from 'express';
import { ArticleModel } from '../models/Article';

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, author_id } = req.body;
    const newArticle = await ArticleModel.createArticle({
      title,
      content,
      author_id,
    });
    res.status(201).json({ article: newArticle });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const articles = await ArticleModel.getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const article = await ArticleModel.getArticleById(articleId);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const { title, content } = req.body;
    const updatedArticle = await ArticleModel.updateArticle(articleId, {
      title,
      content,
    });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ article: updatedArticle });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    const articleId = parseInt(req.params.id, 10);
    const deletedArticle = await ArticleModel.deleteArticle(articleId);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};