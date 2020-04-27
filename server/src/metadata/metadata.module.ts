import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';

@Module({
  providers: [MetadataService],
  controllers: [MetadataController],
  exports: [MetadataService]
})
export class MetadataModule {}
