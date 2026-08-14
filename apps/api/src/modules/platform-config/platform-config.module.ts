import { Global, Module } from '@nestjs/common';
import { APP_CONFIG, DatabaseService, REPOSITORIES } from '../../common/database.service';

@Global()
@Module({
  providers: [
    DatabaseService,
    {
      provide: APP_CONFIG,
      useFactory: (db: DatabaseService) => db.config,
      inject: [DatabaseService],
    },
    {
      provide: REPOSITORIES,
      useFactory: async (db: DatabaseService) => db.init(),
      inject: [DatabaseService],
    },
  ],
  exports: [DatabaseService, APP_CONFIG, REPOSITORIES],
})
export class PlatformConfigModule {}
