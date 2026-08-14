import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, type AuthUser } from '../rbac/rbac';
import { CommerceService } from './commerce.service';

@Controller('catalog')
export class CatalogController {
  constructor(@Inject(CommerceService) private readonly commerce: CommerceService) {}

  @Get()
  catalog() {
    return this.commerce.catalog();
  }
}

@Controller('checkout')
export class CheckoutController {
  constructor(@Inject(CommerceService) private readonly commerce: CommerceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  checkout(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.commerce.checkout(req.user.sub, body);
  }
}

@Controller('payments')
export class PaymentsController {
  constructor(@Inject(CommerceService) private readonly commerce: CommerceService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.commerce.createPayment(req.user.sub, body);
  }

  /** Sandbox completion until Razorpay/Stripe webhooks are wired. */
  @Post('mock-complete')
  @UseGuards(JwtAuthGuard)
  mockComplete(@Req() req: { user: AuthUser }, @Body() body: unknown) {
    return this.commerce.mockComplete(req.user.sub, body);
  }
}

@Controller('orders')
export class OrdersController {
  constructor(@Inject(CommerceService) private readonly commerce: CommerceService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  list(@Req() req: { user: AuthUser }) {
    return this.commerce.listOrders(req.user.sub);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  detail(@Req() req: { user: AuthUser }, @Param('id') id: string) {
    return this.commerce.getOrder(req.user.sub, id);
  }
}
