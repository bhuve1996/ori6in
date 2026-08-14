import { Module } from '@nestjs/common';
import { CompanyApplicantsController } from './company-applicants.controller';

@Module({ controllers: [CompanyApplicantsController] })
export class CompanyApplicantsModule {}
