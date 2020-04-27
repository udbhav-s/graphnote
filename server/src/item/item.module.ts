import { Module, forwardRef } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ConnectionModule } from 'src/connection/connection.module';
import { MetadataModule } from 'src/metadata/metadata.module';

@Module({
  imports: [WorkspaceModule, forwardRef(() => ConnectionModule), MetadataModule],
  providers: [ItemService],
  controllers: [ItemController],
  exports: [ItemService],
})
export class ItemModule {}
