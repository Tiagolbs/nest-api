import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('/signup')
	signUp(@Body() userRegisterDto: UserRegisterDto): Promise<void> {
		return this.authService.signUp(userRegisterDto);
	}

	@Post('/signin')
	signIn(
		@Body() userLoginDto: UserLoginDto,
	): Promise<{ accessToken: string; user: UserDto }> {
		return this.authService.signIn(userLoginDto);
	}

	@Post('/verifyemail')
	verifyEmail(@Body() token: string): Promise<any> {
		return this.authService.verifyEmail(token);
	}
}
