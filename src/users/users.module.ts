import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';

@Module({
	imports: [AuthModule],
	providers: [UsersService, UsersRepository],
	controllers: [UsersController],
	exports: [UsersRepository],
})
export class UsersModule {}
