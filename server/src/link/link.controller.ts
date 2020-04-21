import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthenticatedGuard } from 'src/common/guards/authenticated.guard';
import { FormatResponseInterceptor } from 'src/common/interceptors/formatResponse.interceptor';
import { LinkScrapeDto } from './dto/linkScrape.dto';

@UseGuards(AuthenticatedGuard)
@UseInterceptors(FormatResponseInterceptor)
@Controller('api/link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  async scrape(@Query('url') url: string): Promise<LinkScrapeDto> {
    return await this.linkService.scrape(url);
  }
}
