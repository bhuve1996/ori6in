import { Module } from '@nestjs/common';
import { AiChatController } from '../student-dashboard/student.controllers';

@Module({ controllers: [AiChatController] })
export class AiChatModule {}
