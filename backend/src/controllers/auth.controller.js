import { loginUser, registerUser } from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await loginUser(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logout successful' });
};
