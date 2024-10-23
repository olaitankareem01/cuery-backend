import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ParseTransactionDto } from '../../src/models/dtos/ParseTransaction.dto';



@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('parse')
  parse(@Body() parseTransactionDto: ParseTransactionDto) {
    this.transactionService.parseTransaction(parseTransactionDto.transaction);
    return { status: 'ok', message: 'Transaction parsed and stored successfully' };
  }


  @Get('query')
  @ApiOperation({ summary: 'Query stored X12 271 transactions' })
  @ApiResponse({
    status: 200,
    description: 'Query successful',
    schema: {
      example: {
        subscriber_name: 'DOE JOHN',
        plan_name: 'GOLD PLAN',
        eligibility_date: '2020-01-01',
      },
    },
  })
  @ApiQuery({name:'subscriber_id',type:String})
  @ApiQuery({name:'service_type',type:String})
  queryTransaction(
    @Query('subscriber_id') subscriberId: string,
    @Query('service_type') serviceType: string,
  ) {
    return this.transactionService.queryTransactions(subscriberId, serviceType);
  }
}
