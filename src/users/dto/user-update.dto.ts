import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
	ValidateIf,
} from 'class-validator';
import { Match } from 'src/auth/decorator/match.decorator';

export class UserUpdateDto {
	@IsOptional()
	@IsString()
	@MinLength(4)
	username: string;

	@IsOptional()
	@IsEmail()
	email: string;

	@IsString()
	@IsOptional()
	@MinLength(4)
	@MaxLength(20)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'Password is to weak',
	})
	password: string;

	@ValidateIf((o) => o.password != undefined)
	@Match('password', { message: 'Confirm password does not match' })
	passwordConfirm: string;

	@IsOptional()
	@IsString()
	about: string;

	@IsOptional()
	@IsString()
	currentPassword: string;
}
