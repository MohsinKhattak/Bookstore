import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please Send Complete Details' });
    }

    const userExists = await authService.userExistsByEmail(email);
    if (userExists) {
      return res
        .status(409)
        .json({ message: 'User With Same Email Already Exists' });
    }

    const newUser = await authService.createUser({ name, email, password });

    return res.status(201).json({
      message: 'User Registered Successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please Send Complete Details' });
    }

    const userExists = await authService.findUserByEmail(email);

    if (
      !userExists ||
      !(await authService.comparePassword(userExists, password))
    ) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = authService.makeJwt(String(userExists._id));

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(201).json({
      message: 'Logged in Successfully',
      user: {
        _id: userExists._id,
        email: userExists.email,
        name: userExists.name,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logout = (req: Request, res: Response): Response => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    expires: new Date(0),
  });

  return res.status(200).json({ message: 'Logged out successfully' });
};

export const authenticateMe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = req.user?.id;

    if (!id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await authService.findUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'No Such User Found' });
    }

    return res.status(200).json({ message: 'Success', user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
