import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import got from 'got';
import * as normalizeUrl from 'normalize-url';
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
  private readonly logger = new Logger(MetadataService.name);
  constructor(@Inject('MetadataModel') private metadataModel: ModelClass<MetadataModel>) {}

  async scrape(link: string): Promise<Partial<MetadataModel>> {
    link = normalizeUrl(link, { forceHttps: true });
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

  // clear all unreferenced metadata rows periodically
  @Cron(CronExpression.EVERY_15_MINUTES)
  async removeUnreferenced() {
    this.logger.log("CLEARING UNREFERENCED METADATA");
    const knex = this.metadataModel.knex();
    return await this.metadataModel
      .query()
      .whereNotIn("id",
        knex("items").select("metadata_id").whereNotNull("metadata_id")
      )
      .whereNotIn("id",
        knex("connections").select("metadata_id").whereNotNull("metadata_id")
      )
      .del();
  }
}
