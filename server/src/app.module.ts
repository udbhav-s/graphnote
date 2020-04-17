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
import { LinkModule } from './link/link.module';

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, WorkspaceModule, ItemModule, ConnectionModule, TagModule, LinkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
