import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service.js';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  async getAllData() {
    return this.dataService.getAllData();
  }
}
