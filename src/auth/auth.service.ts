import {
	ForbiddenException,
	HttpException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserDto } from './dto/user.dto';
import { EmailService } from 'src/email/email.service';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';

@Injectable()
export class AuthService {
	constructor(
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
		private emailService: EmailService,
	) {}

	async signUp(userRegisterDto: UserRegisterDto): Promise<void> {
		await this.usersRepository.createUser(userRegisterDto);
		await this.emailService.sendConfirmationEmail(userRegisterDto.email);
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
			const payload: JwtPayload = { email, action: 'signIn' };
			const accessToken: string = await this.jwtService.sign(payload);
			const userDto: UserDto = {
				id: user.id,
				email: user.email,
				username: user.username,
				about: null,
			};
			return { accessToken, user: userDto };
		}

		throw new UnauthorizedException();
	}

	async resetPassword(
		token: string,
		userUpdateDto: UserUpdateDto,
	): Promise<object> {
		try {
			// await this.jwtService.verify(token);
			const decodedToken = await this.jwtService.decode(token);
			const { email, action } = decodedToken;
			const user = await this.usersRepository.findOneBy({ email });
			if (user && action == 'resetPassword') {
				await this.usersRepository.updateUser(user.id, userUpdateDto);
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
}
