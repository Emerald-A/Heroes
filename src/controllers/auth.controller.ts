import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../middlewares/async.mw';
import logger from '../utils/logger.util';
import { RegisterDTO } from '../dtos/auth.dto';
import { User } from '../models/User.model';
import bcrypt, { genSalt, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { rmSync } from 'fs';
import { avatarsData } from '../config/seeds/avatar.seed';

/**
 * @name register
 * @description Registers a new user for the application
 * @route POST /auth/register
 * @access everyone
 *
 */

config();

const JWT_SECRET = process.env.JWT_SECRET;

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

  const body = req.body as RegisterDTO;

  const getRandomInt = (max: number) => Math.floor(Math.random() * max);

  // vickie- implementation of register goes here with email and password
  try {
    const { email, password, username, nationality } = body;

    const selectedAvatar = avatarsData[getRandomInt(avatarsData.length - 1)];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        nationality,
        avatarLink: selectedAvatar,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET || '', { expiresIn: '24h' });

      res.status(201).json({
        message: 'New User has been registered successfully!',
        newUser: {
          id: newUser._id, 
          username: newUser.username, 
          email: newUser.email, 
          nationality: newUser.nationality,
        }
      });

    } else {
      return res.status(400).json({ message: 'User already exist' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Oops! Internal server error', error });
  }
});

//  vickie - login and authentication with jwt

/**
 * @name login
 * @description logs in a registered user into the application
 * @route POST /auth/login
 * @access registered user
 */

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body as RegisterDTO;

    const user = await User.findOne({ username });
   
    if (user) {

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {

        const token = jwt.sign({ id: user._id }, JWT_SECRET || '', { expiresIn: '24h' });

        res.cookie('token', token, { httpOnly: true, secure: true });

        res.status(200).json({
          message: 'welcome back!',
          data: { token, id: user._id, 
            username: user.username, 
            email: user.email, 
            nationality: user.nationality }
        });

      } else {
        res.status(400).json({ message: 'Invalid username or password' });
      }
    } else {
      res.status(400).json({ message: 'Invalid email or password entered! check your credentials and try again' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Oops! internal server error', error });
  }
});

/**
 * @name logout
 * @description logs out a user from the application
 * @route POST /auth/logout
 * @access loggedIn user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  //  clear token
  res.clearCookie('token');
  // redirect to home
  res.redirect('/');
});
