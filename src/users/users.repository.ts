import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../auth/entity/user.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(userRegisterDto: UserRegisterDto): Promise<void> {
		const { email, username, password } = userRegisterDto;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = this.create({
			email,
			username,
			password: hashedPassword,
		});

		try {
			await this.save(user);
		} catch (error) {
			if (error.code === '23505') {
				//duplicate username
				throw new ConflictException('Email already exists.');
			} else {
				throw new InternalServerErrorException(error.message);
			}
		}
	}

	async updateUser(id: number, userUpdateDto: UserUpdateDto): Promise<void> {
		try {
			const user = await this.findOneBy({ id });
			const password: string = userUpdateDto.password;
			if (password) {
				const salt = await bcrypt.genSalt();
				const hashedPassword = await bcrypt.hash(password, salt);
				user.password = hashedPassword;
			}
			const about: string = userUpdateDto.about;
			if (about) {
				user.about = about;
			}
			this.save(user);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
