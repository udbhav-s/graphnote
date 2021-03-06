import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ItemModule } from './item/item.module';
import { ConnectionModule } from './connection/connection.module';
import { TagModule } from './tag/tag.module';
import { MetadataModule } from './metadata/metadata.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'public'),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    DatabaseModule,
    WorkspaceModule,
    ItemModule,
    ConnectionModule,
    TagModule,
    MetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
