import { Module } from '@nestjs/common';
import { CatalogModule } from '../catalog/catalog.module';

/** Checkout is registered via CatalogModule commerce controllers. */
@Module({ imports: [CatalogModule] })
export class CheckoutModule {}
