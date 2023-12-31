import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

export const mailerConfig = async (
	configService: ConfigService,
): Promise<MailerOptions> => {
	return {
		template: {
			dir: path.resolve(__dirname, '..', '..', 'templates'),
			adapter: new HandlebarsAdapter(),
			options: {
				extName: '.hbs',
				layoutsDir: path.resolve(__dirname, '..', '..', 'templates'),
			},
		},
		transport: configService.get('MAIL_TRANSPORT'),
	};
};
