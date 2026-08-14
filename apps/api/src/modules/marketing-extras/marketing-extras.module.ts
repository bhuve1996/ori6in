import { Module } from '@nestjs/common';
import { MarketingExtrasController } from './marketing-extras.controller';

@Module({ controllers: [MarketingExtrasController] })
export class MarketingExtrasModule {}
