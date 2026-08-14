import { Module } from '@nestjs/common';
import {
  CatalogController,
  CheckoutController,
  OrdersController,
  PaymentsController,
} from './commerce.controllers';
import { CommerceService } from './commerce.service';

@Module({
  controllers: [CatalogController, CheckoutController, PaymentsController, OrdersController],
  providers: [CommerceService],
  exports: [CommerceService],
})
export class CatalogModule {}
