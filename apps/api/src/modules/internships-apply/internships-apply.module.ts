import { Module } from '@nestjs/common';
import { InternshipsModule } from '../internships/internships.module';

/** Apply is registered via InternshipsModule. */
@Module({ imports: [InternshipsModule] })
export class InternshipsApplyModule {}
