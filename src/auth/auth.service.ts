import {
	ForbiddenException,
	HttpCode,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserDto } from './dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
	constructor(
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
		private mailerService: MailerService,
	) {}

	async signUp(userRegisterDto: UserRegisterDto): Promise<void> {
		await this.usersRepository.createUser(userRegisterDto);
		const payload: JwtPayload = { email: userRegisterDto.email };
		const confirmToken: string = await this.jwtService.sign(payload);
		const mail = {
			to: userRegisterDto.email,
			from: 'jorgeematheus@email.com',
			subject: 'Email de confirmação',
			template: 'email-confirmation',
			context: {
				token: confirmToken,
			},
		};
		await this.mailerService.sendMail(mail);
	}

	async signIn(
		userLoginDto: UserLoginDto,
	): Promise<{ accessToken: string; user: UserDto }> {
		const { email, password } = userLoginDto;
		const user = await this.usersRepository.findOneBy({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
			if (!user.isEmailConfirmed) {
				throw new ForbiddenException('Email not verified');
			}
			const payload: JwtPayload = { email };
			const accessToken: string = await this.jwtService.sign(payload);
			const userDto: UserDto = {
				id: user.id,
				email: user.email,
				name: user.name,
			};
			return { accessToken, user: userDto };
		}

		throw new UnauthorizedException();
	}

	async verifyEmail(token: string): Promise<any> {
		const decodedToken = await this.jwtService.decode(token);
		const { email } = decodedToken;
		const user = await this.usersRepository.findOneBy({ email });
		if (user) {
			user.isEmailConfirmed = true;
			return HttpCode(200);
		} else {
			return HttpCode(404);
		}
	}
}
