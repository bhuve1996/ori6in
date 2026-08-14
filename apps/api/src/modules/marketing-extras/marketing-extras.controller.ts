import { Controller, Get } from '@nestjs/common';

@Controller('marketing')
export class MarketingExtrasController {
  @Get()
  index() {
    return {
      successStories: { status: 'optional', path: '/success-stories' },
      events: { status: 'optional', path: '/events' },
      careers: { status: 'optional', path: '/careers' },
      support: { status: 'optional', path: '/support' },
    };
  }
}
