import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './location.dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLocations() {
    try {
      const locations = await this.prisma.location.findMany({
        where: { isDeleted: false },
      });
      return locations;
    } catch (error) {
      this.logger.error('Error fetching locations', error);
      throw error;
    }
  }

  async getLocationById(locationId: string) {
    try {
      const location = await this.prisma.location.findUnique({
        where: { locationId, isDeleted: false },
      });
      return location;
    } catch (error) {
      this.logger.error(`Error fetching location with ID ${locationId}`, error);
      throw error;
    }
  }

  async createLocation(data: CreateLocationDto) {
    try {
      const newLocation = await this.prisma.location.create({
        data: {
          name: data.name,
          description: data.description,
          country: data.country,
          region: data.region,
          city: data.city,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          postalCode: data.postalCode,
          gpsLat: data.latitude,
          gpsLong: data.longitude,
          isVirtual: data.isVirtual,
        },
      });

      return {
        message: 'Location created successfully',
        location: newLocation,
        locations: await this.getLocations(),
      };
    } catch (error) {
      this.logger.error('Error creating location', error);
      throw error;
    }
  }

  async updateLocation(data: UpdateLocationDto) {
    try {
      const existingLocation = await this.getLocationById(data.locationId);

      if (!existingLocation) {
        throw new Error(`Location with ID ${data.locationId} not found`);
      }

      const updatedLocation = await this.prisma.location.update({
        where: { locationId: data.locationId },
        data: {
          name: data.name,
          description: data.description,
          country: data.country,
          region: data.region,
          city: data.city,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          postalCode: data.postalCode,
          gpsLat: data.latitude,
          gpsLong: data.longitude,
          isVirtual: data.isVirtual,
        },
      });

      return {
        message: 'Location updated successfully',
        location: updatedLocation,
        locations: await this.getLocations(),
      };
    } catch (error) {
      this.logger.error(
        `Error updating location with ID ${data.locationId}`,
        error,
      );
      throw error;
    }
  }

  async deleteLocation(locationId: string) {
    try {
      const existingLocation = await this.getLocationById(locationId);

      if (!existingLocation) {
        throw new Error(`Location with ID ${locationId} not found`);
      }

      await this.prisma.location.update({
        where: { locationId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return {
        message: 'Location deleted successfully',
        locations: await this.getLocations(),
      };
    } catch (error) {
      this.logger.error(`Error deleting location with ID ${locationId}`, error);
      throw error;
    }
  }
}
