import {
	IsEmail,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { Match } from '../decorator/match.decorator';

export class UserRegisterDto {
	@IsString()
	@MinLength(4)
	@Matches(/([a-zA-Z]+\s?\b){2,}/, {
		message: 'At least one first name and last name',
	})
	name: string;

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
