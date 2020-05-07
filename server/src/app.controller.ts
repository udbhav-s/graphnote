import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHome(@Res() res) {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
  }
}
