import { Injectable } from '@nestjs/common';
import got from 'got';
import * as metascraperModule from 'metascraper';
import * as metascraperTitleModule from 'metascraper-title';
import * as metascraperDescriptionModule from 'metascraper-description';
import * as metascraperImageModule from 'metascraper-image';
import { LinkScrapeDto } from './dto/linkScrape.dto';

const metascraper = metascraperModule([
  metascraperTitleModule(),
  metascraperImageModule(),
  metascraperDescriptionModule(),
]);

@Injectable()
export class LinkService {
  async scrape(link: string): Promise<LinkScrapeDto> {
    const { body: html, url } = await got(link);
    return await metascraper({ html, url });
  }
}
