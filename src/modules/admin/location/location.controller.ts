import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async getLocations() {
    return this.locationService.getLocations();
  }

  @Post()
  async createLocation(@Body() data: CreateLocationDto) {
    return this.locationService.createLocation(data);
  }

  @Put()
  async updateLocation(@Body() data: UpdateLocationDto) {
    return this.locationService.updateLocation(data);
  }

  @Delete(':locationId')
  async deleteLocation(@Param('locationId') locationId: string) {
    return this.locationService.deleteLocation(locationId);
  }
}
