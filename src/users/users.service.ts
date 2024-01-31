import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entity/user.entity';

@Injectable()
export class UsersService {
	async getCurrentUser(user: User): Promise<object> {
		return user;
	}
}
