import { Module } from '@nestjs/common';
import {
  AdminCertificatesController,
  PublicCertificatesController,
  StudentCertificatesController,
} from './certificates.controller';
import { CertificatesService } from './certificates.service';

@Module({
  controllers: [
    StudentCertificatesController,
    AdminCertificatesController,
    PublicCertificatesController,
  ],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
