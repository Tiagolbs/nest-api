import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';

export class UserRegisterDto {
	@IsOptional()
	@IsString()
	@MinLength(4)
	username: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsString()
	@MinLength(4)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'Password is to weak',
	})
	password: string;

	@Match('password', { message: 'Confirm password does not match' })
	passwordConfirm: string;
}
