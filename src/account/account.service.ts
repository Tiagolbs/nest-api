import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountService {
	constructor(private usersRepository: UsersRepository) {}
	async getProfile(user: User): Promise<object> {
		const userWithoutPassword: User = { ...user };
		delete userWithoutPassword.password;
		return userWithoutPassword;
	}

	async updateAccount(
		user: User,
		userUpdateDto: UserUpdateDto,
	): Promise<object> {
		const userAccount = await this.usersRepository.findOneBy({
			id: user.id,
		});

		if (
			userUpdateDto.password &&
			!(await bcrypt.compare(
				userUpdateDto.currentPassword,
				userAccount.password,
			))
		) {
			throw new HttpException(
				'Current password does not match',
				HttpStatus.UNAUTHORIZED,
			);
		}

		try {
			await this.usersRepository.updateUser(user.id, userUpdateDto);
			return {
				statusCode: HttpStatus.OK,
				message: 'Success',
			};
		} catch (error) {
			throw new HttpException(
				error.name,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
