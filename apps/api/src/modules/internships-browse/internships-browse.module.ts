import { Module } from '@nestjs/common';
import { InternshipsModule } from '../internships/internships.module';

/** Browse is registered via InternshipsModule. */
@Module({ imports: [InternshipsModule] })
export class InternshipsBrowseModule {}
