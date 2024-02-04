import { MailerService } from '@nestjs-modules/mailer';
import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interface/jwt-payload.interface';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class EmailService {
	constructor(
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
		private mailerService: MailerService,
	) {}

	async verifyEmail(token: string): Promise<object> {
		try {
			await this.jwtService.verify(token);
			const decodedToken = await this.jwtService.decode(token);
			const { email, action } = decodedToken;
			const user = await this.usersRepository.findOneBy({ email });
			if (user && action == 'verifyEmail') {
				user.isEmailConfirmed = true;
				await this.usersRepository.save(user);
				return {
					statusCode: HttpStatus.OK,
					message: 'Success',
				};
			} else {
				throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
			}
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				throw new HttpException(
					'Confirmation token has expired',
					HttpStatus.UNAUTHORIZED,
				);
			} else {
				throw new HttpException(
					error.name,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
		}
	}

	async sendConfirmationEmail(email: string): Promise<object> {
		try {
			const user = await this.usersRepository.findOneBy({ email });
			if (user) {
				const payload: JwtPayload = {
					email: email,
					action: 'verifyEmail',
				};
				const confirmToken: string = this.jwtService.sign(payload);
				const mail = {
					to: email,
					from: 'teste@email.com',
					subject: 'Email de confirmação',
					template: 'email-confirmation',
					context: {
						token: confirmToken,
					},
				};
				await this.mailerService.sendMail(mail);
				return {
					statusCode: HttpStatus.OK,
					message: 'Success',
				};
			}
			throw new NotFoundException('User not found');
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
	}

	async sendResetPasswordEmail(email: string): Promise<object> {
		try {
			const user = await this.usersRepository.findOneBy({ email });
			if (user) {
				const payload: JwtPayload = {
					email: email,
					action: 'resetPassword',
				};
				const verifyEmailToken: string = this.jwtService.sign(payload);
				const mail = {
					to: email,
					from: 'teste@email.com',
					subject: 'Esqueci minha senha',
					template: 'reset-password',
					context: {
						token: verifyEmailToken,
					},
				};
				await this.mailerService.sendMail(mail);
				return {
					statusCode: HttpStatus.OK,
					message: 'Success',
				};
			}
			throw new NotFoundException('User not found');
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
	}
}
