import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const existingUser = await UserModel.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.createUser({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET!);
    res.status(201).json({ token, user: { ...newUser, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    res.status(200).json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: any, res: Response) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserModel.deleteUser(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};