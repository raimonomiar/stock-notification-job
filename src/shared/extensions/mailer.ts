import { createTransport } from 'nodemailer';
import { IMail, ISMTP } from '../interfaces';
export class NodeMailer {

    async sendMail(mail: IMail, options: ISMTP = null) {
        const transporter = createTransport({
            host: options != null ? options.host : process.env.SMTP_HOST,
            port: options != null ? options.port : parseInt(process.env.SMTP_PORT),
            secure: options != null ? options.secure : process.env.SMTP_SECURE.toLowerCase() == 'true' ? true : false,
            auth: {
                user: options != null ? options.user : process.env.SMTP_USER,
                pass: options != null ? options.password : process.env.SMTP_PASSWORD
            },
            tls: {
                minVersion: 'TLSv1',
                rejectUnauthorized: false
            }
        });

        return await transporter.sendMail(mail);
    }
}