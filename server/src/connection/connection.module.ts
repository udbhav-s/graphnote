import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ConnectionController } from './connection.controller';
import { ItemModule } from 'src/item/item.module';

@Module({
  imports: [WorkspaceModule, ItemModule],
  providers: [ConnectionService],
  controllers: [ConnectionController]
})
export class ConnectionModule {}
