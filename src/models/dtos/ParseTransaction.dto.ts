import { ApiProperty } from '@nestjs/swagger';

export class ParseTransactionDto {
  @ApiProperty({
    description: 'X12 271 transaction as a string',
    example: 'ISA*00*          *00*          *ZZ*SUBMITTERID    *ZZ*RECEIVERID...',
  })
  transaction: string;
}
