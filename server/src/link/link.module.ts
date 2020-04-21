import { Module } from '@nestjs/common';
import { LinkService } from './link.service';
import { LinkController } from './link.controller';

@Module({
  providers: [LinkService],
  controllers: [LinkController],
})
export class LinkModule {}
