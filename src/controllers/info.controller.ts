import express, { Request, Response } from 'express';
import { herosData } from '../config/seeds/hero.seed';
import { avatarsData } from '../config/seeds/avatar.seed';
import { User } from '../models/User.model';
import { Game } from "../models/Game.model";
import { GameHistory } from "../models/GameHistory.model";
import mongoose from 'mongoose';

// Async function to send comic data
export const sendComicData = async (req: Request, res: Response) => {
  try {
    // Send success response to the client
    res.status(200).json({
      message: 'Comic data sent successfully!',
      data: herosData,
    });
  } catch (err) {
    // Handle any errors and send the error message to the client
    res.status(500).json({
      message: 'Failed to send comic data',
      error: err,
    });
  }
};

// Async function to send Avatar data
export const sendAvatarData = async (req: Request, res: Response) => {
  try {
    // Send success response to the client
    res.status(200).json({
      message: 'Avatar data sent successfully!',
      data: avatarsData,
    });
  } catch (err) {
    // Handle any errors and send the error message to the client
    res.status(500).json({
      message: 'Failed to send avatar data',
      error: err,
    });
  }
};

export const userInformation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user:any = await User.findById(userId)
    .populate('gameHistory')
    .exec();
    // console.log("This first id user", user)
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    // console.log("This is user", user._id)
    // const gameHistory = await GameHistory.findOne({userId: user._id});
    // console.log("This is game", gameHistory)
    // if (!gameHistory) {
    //   return res.status(404).json({ error: 'Game history not found' });
    // }

    const games = await Game.find({ userId: user._id });

    const numberOfGames = games.length;
    const totalGameMinutes = games.reduce((total, game) => total + game.gameTimes, 0);
    const totalGameCredits = games.reduce((total, game) => total + game.gameCredits, 0);
    const highestScore = Math.max(...games.map(game => game.totalPoints), 0);
    const lastScore = games.length > 0 ? games[games.length - 1].totalPoints : 0;

    // res.status(200).json({ message: 'Successfully retrieved user information', user });
    return res.status(200).json({
      username: user.username,
      email: user.email,
      nationality: user.nationality,
      avatarLink: user.avatarLink,
      // gameHistory: {
      //   totalGames: gameHistory.totalGames,
      //   totalPrizes: gameHistory.totalPrizes,
      // },
      numberOfGames: numberOfGames,
      totalGameMinutes: totalGameMinutes,
      totalGameCredits: totalGameCredits,
      highestScore: highestScore,
      lastScore: lastScore,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user information', error: err });
  }
};
