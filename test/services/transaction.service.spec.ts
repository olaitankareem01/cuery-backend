import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { validateTransaction } from 'src/helpers/checkValidity';
import { TransactionService } from '../../src/transaction/transaction.service';

jest.mock('../../src/helpers/checkValidity', () => ({
  validateTransaction: jest.fn(),
}));

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('parseTransaction', () => {
    it('should parse and save a transaction successfully', () => {
      const transactionString = 'ISA*00* *00* *ZZ*SUBMITTERID*ZZ*RECEIVERID*200501*1750*^*00501*000000005*0*T*:~GS*HB*SUBMITTERID*RECEIVERID*20200501*1750*5*X*005010X279A1~ST*271*0005*005010X279A1~BHT*0022*11*10001238*20200501*1750~HL*1**20*1~NM1*PR*2*PRIMARYHEALTH*****PI*PRIMID~HL*2*1*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*3*2*22*0~TRN*1*93175-012552*9877281239~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**PRIMARYPLAN~EB*L~HL*4*1*20*1~NM1*PR*2*SECONDARYHEALTH*****PI*SECID~HL*5*4*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*6*5*22*0~TRN*1*93175-012553*9877281240~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**SECONDARYPLAN~EB*L~SE*25*0005~GE*1*5~IEA*1*000000005';
      
      service.parseTransaction(transactionString);

      const transaction = service['transactions'][0]; 
      expect(transaction.subscriberId).toBeDefined();
      expect(transaction.subscriberName).toBeDefined();
      expect(transaction.planName).toBeDefined();
      expect(transaction.eligibilityDate).toBeDefined();
    });
  });

  describe('queryTransactions', () => {
    it('should return transaction details for valid subscriber ID and service type', () => {
      const transactionString = 'ISA*00* *00* *ZZ*SUBMITTERID*ZZ*RECEIVERID*200501*1750*^*00501*000000005*0*T*:~GS*HB*SUBMITTERID*RECEIVERID*20200501*1750*5*X*005010X279A1~ST*271*0005*005010X279A1~BHT*0022*11*10001238*20200501*1750~HL*1**20*1~NM1*PR*2*PRIMARYHEALTH*****PI*PRIMID~HL*2*1*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*3*2*22*0~TRN*1*93175-012552*9877281239~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**PRIMARYPLAN~EB*L~HL*4*1*20*1~NM1*PR*2*SECONDARYHEALTH*****PI*SECID~HL*5*4*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*6*5*22*0~TRN*1*93175-012553*9877281240~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**SECONDARYPLAN~EB*L~SE*25*0005~GE*1*5~IEA*1*000000005';
      service.parseTransaction(transactionString); 

      const result = service.queryTransactions('66677888806', '30');

      expect(result).toEqual({
        subscriber_name: 'BROWN DAVID',
        plan_name: 'PRIMARYPLAN,SECONDARYPLAN',
        eligibility_date: '20200501',
      });
    });

    it('should throw NotFoundException for invalid subscriber ID or service type', () => {
      const transactionString = 'ISA*00* *00* *ZZ*SUBMITTERID*ZZ*RECEIVERID*200501*1750*^*00501*000000005*0*T*:~GS*HB*SUBMITTERID*RECEIVERID*20200501*1750*5*X*005010X279A1~ST*271*0005*005010X279A1~BHT*0022*11*10001238*20200501*1750~HL*1**20*1~NM1*PR*2*PRIMARYHEALTH*****PI*PRIMID~HL*2*1*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*3*2*22*0~TRN*1*93175-012552*9877281239~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**PRIMARYPLAN~EB*L~HL*4*1*20*1~NM1*PR*2*SECONDARYHEALTH*****PI*SECID~HL*5*4*21*1~NM1*1P*1*WHITE*JENNIFER****XX*1234567897~HL*6*5*22*0~TRN*1*93175-012553*9877281240~NM1*IL*1*BROWN*DAVID****MI*66677888806~DMG*D8*19820908~DTP*346*D8*20200501~EB*1**30**SECONDARYPLAN~EB*L~SE*25*0005~GE*1*5~IEA*1*000000005';
      service.parseTransaction(transactionString);

      expect(() => {
        service.queryTransactions('nonexistent-id', 'NONEXISTENTPLAN');
      }).toThrow(NotFoundException);
    });
  });
});
