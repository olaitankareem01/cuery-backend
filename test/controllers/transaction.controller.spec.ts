import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../../src/transaction/transaction.controller';
import { TransactionService } from '../../src/transaction/transaction.service';
import { NotFoundException } from '@nestjs/common';
import { ParseTransactionDto } from '../../src/models/dtos/ParseTransaction.dto';

describe('TransactionController', () => {
  let controller: TransactionController;
  let transactionService: TransactionService;

  const mockTransactionService = {
    parseTransaction: jest.fn(),
    queryTransactions: jest.fn(),
  } as Partial<TransactionService>; 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    transactionService = module.get<TransactionService>(TransactionService);
  });

  describe('parse', () => {
    it('should parse and store the transaction successfully', () => {
      const parseTransactionDto: ParseTransactionDto = {
        transaction: 'NM1*IL*DOE*JOHN*...~EB*ServiceType1*...~DTP*346*20220101',
      };

      const result = controller.parse(parseTransactionDto);

      expect(transactionService.parseTransaction).toHaveBeenCalledWith(parseTransactionDto.transaction);
    });
  });

  describe('queryTransaction', () => {
    it('should return transaction details for valid subscriber ID and service type', () => {
      const subscriberId = 'subscriber-id'; 
      const serviceType = '30'; 
      const expectedResult = {
        subscriber_name: 'DOE JOHN', 
        plan_name: 'GOLD PLAN', 
        eligibility_date: '2020-01-01', 
      };


      (transactionService.queryTransactions as jest.Mock).mockReturnValue(expectedResult);

      const result = controller.queryTransaction(subscriberId, serviceType);

      expect(transactionService.queryTransactions).toHaveBeenCalledWith(subscriberId, serviceType);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException for invalid subscriber ID or service type', () => {
      const subscriberId = 'invalid-id';
      const serviceType = 'invalid-service';

   
      (transactionService.queryTransactions as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('Transaction not found for the given Subscriber ID and Service Type');
      });

      expect(() => controller.queryTransaction(subscriberId, serviceType)).toThrow(NotFoundException);
    });
  });
});
