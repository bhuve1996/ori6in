import { Module } from '@nestjs/common';
import { ParentMessagingController } from './parent-messaging.controller';

@Module({ controllers: [ParentMessagingController] })
export class ParentMessagingModule {}
