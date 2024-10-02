import fs from 'fs';
import { User } from '../../models/User.model';
import Logger from '../../utils/logger.util';


const usersData = JSON.parse(
    fs.readFileSync(`${__dirname.split("config")[0]}_data/users.json`, "utf-8")
  );
  
  export const seedUsers = async () => {
    try {
      let count: number = 0;
      const users: number = await User.countDocuments();
  
      if (users === 0) {
        for (let i = 0; i < usersData.length; i++) {
          let item = usersData[i];
          let user = await User.create(item);
  
          if (user) {
            count += 1;
          }
        }
        if (count > 0) {
          Logger.log({
            data: "users seeded successfuly",
            type: "success",
          });
        }
      }
    } catch (err) {
    //   Logger.log({ label: "ERR:", data: err });
    }
}
  