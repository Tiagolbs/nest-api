import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async createUser(userRegisterDto: UserRegisterDto): Promise<void> {
		const { email, name, password } = userRegisterDto;

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = this.create({
			email,
			name,
			password: hashedPassword,
		});

		try {
			await this.save(user);
		} catch (error) {
			if (error.code === '23505') {
				//duplicate username
				throw new ConflictException('Email already exists.');
			} else {
				throw new InternalServerErrorException();
			}
		}
	}
}
