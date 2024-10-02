import app from './config/app.config';
import colors from 'colors';
import connectDB from './config/db.config';
import seedData from './config/seeds/seeder.seed';

const connect = async (): Promise<void> => {
  // connect database
  await connectDB();

  await seedData();
};

connect();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(colors.yellow.bold(`Server running in ${process.env.NODE_ENV} mode on ${process.env.PORT}`));
});

// catch unhandled promise rejection
process.on('unhandledRejection', (err: any, promise) => {
  console.log(colors.red(`err: ${err.message}`));
  server.close(() => process.exit(1));
});
