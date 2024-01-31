import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
	constructor(private usersService: UsersService) {}

	@Get('/profile')
	verifyEmail(@GetUser() user: User): Promise<object> {
		return this.usersService.getCurrentUser(user);
	}
}
