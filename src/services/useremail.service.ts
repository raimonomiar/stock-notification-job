import { UserEmail } from '../models';
export class UserEmailService {

    async getUsersDetail() {
        return await UserEmail.findAll({
            attributes: ['useremailid', 'email'],
            where: { deletedat: null}
        })
    }
}