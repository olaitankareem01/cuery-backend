import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { validateTransaction } from '../helpers/checkValidity';

interface Transaction {
  transaction: string;
  subscriberId: string;
  subscriberName: string;
  planName: string;
  eligibilityDate: string;
  serviceType: string;
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);
  //private transactions: Map<string, Transaction> = new Map();
  private transactions: Transaction[] = [];

  // Parse and store transaction
  parseTransaction(transaction: string) {
    try {
        const parsedTransaction = this.parseX12(transaction);
        console.log(parsedTransaction);
        this.transactions.push(parsedTransaction);
        this.logger.log(`Transaction: ${transaction} saved successfully`);
        
        return { status: 'ok', message: 'Transaction parsed and stored successfully' };
    } catch (error) {
        this.logger.error(`Error parsing transaction: ${transaction}`, error);
        throw error;
    }
}


  // Query stored transactions
  queryTransactions(subscriberId: string, serviceType: string) {
    const transaction = this.transactions.find((t) => 
        t.subscriberId === subscriberId && t.serviceType.split(',').includes(serviceType)
    );

    if (!transaction) {
        throw new NotFoundException('Transaction not found for the given Subscriber ID and Service Type');
    }

    return {
        subscriber_name: transaction.subscriberName,
        plan_name: transaction.planName,
        eligibility_date: transaction.eligibilityDate,
    };
}

  public parseX12(transaction: string): Transaction {
        const segments = transaction.split('~');
        let subscriberId = '';
        let subscriberName = '';
        let eligibilityDate = '';
        const serviceTypesSet = new Set<string>(); 
        const planNamesSet = new Set<string>(); 

        try {
            segments.forEach(segment => {
                const elements = segment.split('*');

                // subscriber Segment (with IL Indicator)
                if (elements[0] === 'NM1' && elements[1] === 'IL') {
                    subscriberName = `${elements[3]} ${elements[4]}`; 
                    subscriberId = elements[9]; 
                }

                // plan and service type
                if (elements[0] === 'EB') {
                   
                    if (elements[3]) {
                        serviceTypesSet.add(elements[3]);
                    }
                    if (elements[5]) {
                        planNamesSet.add(elements[5]); 
                    }
                }

                //  Date Segment
                if (elements[0] === 'DTP' && elements[1] === '346') {
                    eligibilityDate = elements[3]; 
                }
            });


            const serviceTypes = Array.from(serviceTypesSet);
            const planNames = Array.from(planNamesSet);

            validateTransaction(subscriberId, subscriberName, planNamesSet, eligibilityDate);

            this.logger.log(`Successfully parsed transaction for Subscriber ID: ${subscriberId}`);

            return {
                transaction,
                subscriberId,
                subscriberName,
                planName: planNames.join(",").toString(), 
                eligibilityDate,
                serviceType: serviceTypes.join(",").toString() 
            };

        } catch (error) {
            this.logger.error(`Error occured: ${error.message}`);  
            throw error;
        }

    }


  
}
