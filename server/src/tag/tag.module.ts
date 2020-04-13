import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [WorkspaceModule],
  providers: [TagService],
  exports: [TagService],
  controllers: [TagController]
})
export class TagModule {}
