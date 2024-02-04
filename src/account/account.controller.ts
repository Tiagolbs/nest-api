import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserUpdateDto } from 'src/users/dto/user-update.dto';

@Controller('account')
@UseGuards(AuthGuard())
export class AccountController {
	constructor(private accountService: AccountService) {}

	@Get('/')
	getProfile(@GetUser() user: User): Promise<object> {
		return this.accountService.getProfile(user);
	}

	@Patch('/update')
	updateAccount(
		@GetUser() user: User,
		@Body() userUpdateDto: UserUpdateDto,
	): Promise<object> {
		return this.accountService.updateAccount(user, userUpdateDto);
	}
}
