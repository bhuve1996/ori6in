import { Module } from '@nestjs/common';
import { ParentApprovalsController } from './parent-approvals.controller';

@Module({ controllers: [ParentApprovalsController] })
export class ParentApprovalsModule {}
