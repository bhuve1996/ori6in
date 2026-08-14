import { Module } from '@nestjs/common';
import { CertificatesModule } from '../certificates/certificates.module';
import { LearningService } from './learning.service';

@Module({
  imports: [CertificatesModule],
  providers: [LearningService],
  exports: [LearningService],
})
export class LearningModule {}
