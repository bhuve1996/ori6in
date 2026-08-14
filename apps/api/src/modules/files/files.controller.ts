import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

/** File upload port — returns a storage key. S3 adapter plugs in via env later. */
@Controller('files')
export class FilesController {
  @Post('upload')
  async upload(
    @Body() body: { filename?: string; contentType?: string; sizeBytes?: number },
  ) {
    const key = `uploads/${randomUUID()}-${body.filename ?? 'file'}`;
    return {
      key,
      url: `/files/${key}`,
      contentType: body.contentType ?? 'application/octet-stream',
      sizeBytes: body.sizeBytes ?? 0,
    };
  }
}
