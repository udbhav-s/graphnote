import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ConnectionController } from './connection.controller';
import { ItemModule } from 'src/item/item.module';
import { TagModule } from 'src/tag/tag.module';

@Module({
  imports: [WorkspaceModule, ItemModule, TagModule],
  providers: [ConnectionService],
  controllers: [ConnectionController]
})
export class ConnectionModule {}
