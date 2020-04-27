import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { MetadataModel } from 'src/database/models/metadata.model';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Get()
  async scrape(@Query('url') url: string): Promise<Partial<MetadataModel>> {
    try {
      return await this.metadataService.scrape(url);
    }
    catch (err) {
      throw new BadRequestException("Invalid URL");
    }
  }
}
