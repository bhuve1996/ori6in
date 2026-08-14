import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type AuthUser } from '../rbac/rbac';
import { IdentityService } from './identity.service';

@Controller('auth')
export class IdentityController {
  // Explicit @Inject — tsx watch does not emit design:paramtypes metadata.
  constructor(@Inject(IdentityService) private readonly identity: IdentityService) {}

  @Post('register')
  register(@Body() body: unknown) {
    return this.identity.register(body);
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.identity.login(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: unknown) {
    return this.identity.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(@Body() body: unknown) {
    return this.identity.resetPassword(body);
  }

  @Post('request-verification')
  @UseGuards(JwtAuthGuard)
  requestVerification(@Req() req: { user: AuthUser }) {
    return this.identity.requestEmailVerification(req.user.sub);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: unknown) {
    return this.identity.verifyEmail(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: { user: AuthUser }) {
    return this.identity.me(req.user.sub);
  }

  @Post('google')
  google() {
    return this.identity.google();
  }
}
