import { UserEmail } from '../models';
export class UserEmailService {

    async getUsersDetail() {
        return await UserEmail.findAll({
            attributes: [['userid', 'userId'], 'email'],
            where: { deletedat: null}
        })
    }
}