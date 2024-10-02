import { seedUsers} from "./user.seed";

const seedData = async () => {
    await seedUsers();
};
 
export default seedData;
