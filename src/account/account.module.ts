import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from 'src/users/users.repository';

@Module({
	imports: [AuthModule],
	controllers: [AccountController],
	providers: [AccountService, UsersRepository],
})
export class AccountModule {}
