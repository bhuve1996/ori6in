import { Module } from '@nestjs/common';
import { ParentPaymentsController } from './parent-payments.controller';

@Module({ controllers: [ParentPaymentsController] })
export class ParentPaymentsModule {}
