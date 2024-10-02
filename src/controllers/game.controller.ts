import express, { Request, Response, NextFunction } from 'express';
import { Game } from '../models/Game.model';
import { PrizeHistory } from '../models/PrizeHistory.model';
import { ILeaderboardDTO } from '../dtos/leaderboard.dto';
import { avatarsData } from "../config/seeds/avatar.seed";
import {  userInformation } from "../controllers/info.controller";

const gameCredits = (input: number) => input * 2;

const gameScores = (input: number) => input * 5;

const totalPoints = (time: number, characters: number) => {
  return gameCredits(time) + gameScores(characters);
};

export const saveGameInfo = async (req: Request, res: Response) => {
  try {
    const { userId, timeRemaining, timeSpent, correctCharacters, playersNotUsed } = req.body;

    const game = new Game({
      userId: userId,
      gameCredits: gameCredits(timeRemaining),
      gameScores: gameScores(correctCharacters),
      gameTimes: timeSpent,
      benchPlayers: playersNotUsed,
      totalPoints: totalPoints(timeRemaining, correctCharacters),
    });

    await game.save();
    

    res.status(200).json({ message: 'Successfully saved game info', data: game });
  } catch (err) {
    res.status(500).json({ message: 'Error saving game info', error: err });
  }
};

export const leaderboard = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const leaderboard = await Game.aggregate([
      {
        $match: {
          datePlayed: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$totalPoints' },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          userId: '$_id',
          username: { $arrayElemAt: ['$user.username', 0] },
          avatar: { $arrayElemAt: ['$user.avatarLink', 0] },
          totalPoints: 1,
        },
      },
    ]);

    const top3Users: ILeaderboardDTO[] = leaderboard.slice(0, 3);
    const positions = ['Gold', 'Silver', 'Bronze'];

    for (let i = 0; i < top3Users.length; i++) {
      const userId = top3Users[i].userId;
      const position = positions[i];

      const newPrizeHistory = new PrizeHistory({
        userId,
        position,
      });

      await newPrizeHistory.save();
    }

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error retrieving leaderboard or updating prize history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const prizeHistory = async (req: Request, res: Response) => {
  try {
    const { userId, position } = req.body;

    // Create new prize history entry
    const prizeHistory = new PrizeHistory({ userId, position });

    // Save to the database
    await prizeHistory.save();

    // Send response
    res.status(201).json(prizeHistory);
  } catch (error) {
    console.error('Error retrieving prize history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const displayGameHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const prize = await PrizeHistory.find({ userId });
    const games = await Game.find({ userId });

    const totalGames: any = games.length; // Count total games played
    const totalPrize: any = prize.reduce((sum, history) => sum + history.prizeAmount, 0); // Sum of all prizes

    res.status(200).json({
      error: false,
      message: 'Display game history successful',
      data: {
        numberOfGames: totalGames,
        totalPrizeAmount: totalPrize,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Error displaying game history' });
  }
};

export const retrieveGameInfo = async (req: Request, res: Response) => {
  try {
    const games = await Game.find({})
    .populate('userId', 'username avatarLink') 
    .exec();
    res.status(200).json({ message: 'Succesfully retrieved game information', data: games });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving game information', error: err });
  }
};
