import { Module, forwardRef } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ConnectionController } from './connection.controller';
import { ItemModule } from 'src/item/item.module';
import { TagModule } from 'src/tag/tag.module';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports: [WorkspaceModule, forwardRef(() => ItemModule), TagModule, MetadataModule],
  providers: [ConnectionService],
  controllers: [ConnectionController],
  exports: [ConnectionService],
})
export class ConnectionModule {}
