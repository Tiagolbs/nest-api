import { Controller, Post, Headers, Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
	constructor(private emailService: EmailService) {}

	@Post('/verifyemail')
	verifyEmail(@Headers('token') token: string): Promise<object> {
		return this.emailService.verifyEmail(token);
	}

	@Post('/sendconfirmationemail')
	sendConfirmationEmail(@Body() emailDto: EmailDto): Promise<object> {
		const { email } = emailDto;
		return this.emailService.sendConfirmationEmail(email);
	}
}
