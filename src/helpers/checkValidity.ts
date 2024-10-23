import { BadRequestException } from "@nestjs/common";




export const validateTransaction = (subscriberId: string, subscriberName: string, planNames: Set<string>, eligibilityDate: string) => {
    if (!subscriberId) {
        throw new BadRequestException("Missing or invalid Subscriber ID");
    }
    if (!subscriberName) {
        throw new BadRequestException("Missing or invalid Subscriber Name");
    }
    if (planNames.size === 0) {
        throw new BadRequestException("Missing or invalid Plan Name(s)");
    }
    if (!eligibilityDate) {
        throw new BadRequestException("Missing or invalid Eligibility Date");
    }
};