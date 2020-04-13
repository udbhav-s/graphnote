import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [ItemService],
  controllers: [ItemController]
})
export class ItemModule {}
