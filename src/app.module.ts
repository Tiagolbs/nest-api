import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { mailerConfig } from './configs/mailer.config';
import { EmailModule } from './email/email.module';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.stage.${process.env.STAGE}`],
			validationSchema: configValidationSchema,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const isProduction = configService.get('STAGE') === 'prod';
				return {
					ssl: isProduction,
					extra: {
						ssl: isProduction
							? { rejectUnauthorized: false }
							: null,
					},
					type: 'postgres',
					autoLoadEntities: true,
					synchronize: true,
					host: configService.get('DB_HOST'),
					port: configService.get('DB_PORT'),
					username: configService.get('DB_USERNAME'),
					password: configService.get('DB_PASSWORD'),
					database: configService.get('DB_DATABASE'),
				};
			},
		}),
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				await mailerConfig(configService),
		}),
		AuthModule,
		EmailModule,
		UsersModule,
		AccountModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
