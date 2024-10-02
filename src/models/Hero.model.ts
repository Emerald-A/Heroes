import mongoose, { Schema, Document } from 'mongoose';

// Interface for Hero
export interface IHero extends Document {
  comic: string;
  character: string;
  iconLink: string;
}

//  Hero Schema
const HeroSchema: Schema = new Schema({
    comic: { type: String, required: true},
     character: { type: String, required: true },
    iconLink: { type: String, required: true },
});

export const Hero = mongoose.model<IHero>('Hero', HeroSchema);



