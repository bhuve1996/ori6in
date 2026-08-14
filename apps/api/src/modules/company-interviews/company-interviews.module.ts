import { Module } from '@nestjs/common';
import { CompanyInterviewsController } from './company-interviews.controller';

@Module({ controllers: [CompanyInterviewsController] })
export class CompanyInterviewsModule {}
