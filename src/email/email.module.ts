import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from 'src/auth/users.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		AuthModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: {
					expiresIn: 600,
				},
			}),
		}),
	],
	providers: [EmailService, UsersRepository],
	controllers: [EmailController],
})
export class EmailModule {}
