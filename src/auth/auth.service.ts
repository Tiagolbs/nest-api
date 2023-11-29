import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserDto } from './dto/user-dto';

@Injectable()
export class AuthService {
	constructor(
		private usersRepository: UsersRepository,
		private jwtService: JwtService,
	) {}

	async signUp(userRegisterDto: UserRegisterDto): Promise<void> {
		return this.usersRepository.createUser(userRegisterDto);
	}

	async signIn(
		userLoginDto: UserLoginDto,
	): Promise<{ accessToken: string; user: UserDto }> {
		const { email, password } = userLoginDto;
		const user = await this.usersRepository.findOneBy({ email });

		if (user && (await bcrypt.compare(password, user.password))) {
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
}
