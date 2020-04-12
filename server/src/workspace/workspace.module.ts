import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [WorkspaceService],
  controllers: [WorkspaceController]
})
export class WorkspaceModule {}
