import { Module } from '@nestjs/common';
import { ParentProgressController } from './parent-progress.controller';

@Module({ controllers: [ParentProgressController] })
export class ParentProgressModule {}
