import { Injectable, Inject } from '@nestjs/common';
import got from 'got';
import * as metascraperModule from 'metascraper';
import * as metascraperTitleModule from 'metascraper-title';
import * as metascraperDescriptionModule from 'metascraper-description';
import * as metascraperImageModule from 'metascraper-image';
import { MetadataModel } from 'src/database/models/metadata.model';
import { ModelClass } from 'objection';

const metascraper = metascraperModule([
  metascraperTitleModule(),
  metascraperImageModule(),
  metascraperDescriptionModule(),
]);

@Injectable()
export class MetadataService {
  constructor(@Inject('MetadataModel') private metadataModel: ModelClass<MetadataModel>) {}

  async scrape(link: string): Promise<Partial<MetadataModel>> {
    const { body: html, url } = await got(link);
    return await metascraper({ html, url });
  }

  async getByUrl(url: string): Promise<MetadataModel> {
    return await this.metadataModel.query().where({ url }).first();
  }

  async getById(id: number): Promise<MetadataModel> {
    return await this.metadataModel.query().findById(id);
  }

  async create(url: string): Promise<MetadataModel> {
    const metadata = await this.scrape(url);
    return await this.metadataModel
      .query()
      .insert({
        ...metadata,
        url
      })
      .returning("*")
      .first();
  }
}
