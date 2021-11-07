import { User } from "../models";

export class UserService {

    async getByEmail(email: string) {
        const user = await  User.findOne({
            attributes: [['guid', 'userid'], 'email', 'password', 'name', 'location'],
            where: {
                deletedat: null,
                email: email
            }
        });
        return user;
    }
}