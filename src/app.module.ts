import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { TransactionService } from './transaction/transaction.service';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  imports: [TransactionModule],
  controllers: [AppController,TransactionController],
  providers: [AppService,TransactionService],
})
export class AppModule {}
