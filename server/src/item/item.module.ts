import { Module, forwardRef } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ConnectionModule } from 'src/connection/connection.module';

@Module({
  imports: [WorkspaceModule, forwardRef(() => ConnectionModule)],
  providers: [ItemService],
  controllers: [ItemController],
  exports: [ItemService],
})
export class ItemModule {}
