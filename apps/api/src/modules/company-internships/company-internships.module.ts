import { Module } from '@nestjs/common';
import { CompanyInternshipsController } from './company-internships.controller';

@Module({ controllers: [CompanyInternshipsController] })
export class CompanyInternshipsModule {}
