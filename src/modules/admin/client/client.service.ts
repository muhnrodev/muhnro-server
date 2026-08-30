import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateClientContactDto,
  CreateClientDto,
  UpdateClientDto,
} from './client.dto';
import { StakeholdersService } from '../stakeholder/stakeholder.service';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stakeholdersService: StakeholdersService,
  ) {}

  async getAllClients() {
    try {
      const clients = await this.prisma.client.findMany({
        include: {
          contacts: true,
          address: true,
          industry: true,
          logo: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              url: true,
              mimeType: true,
              extension: true,
              size: true,
              duration: true,
              width: true,
              height: true,
              altText: true,
              caption: true,
            },
          },
        },
      });
      return clients;
    } catch (error) {
      this.logger.error('Error fetching clients', error);
      throw error;
    }
  }

  async getClientById(clientId: string) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          contacts: true,
          address: true,
          industry: true,
          logo: {
            select: {
              id: true,
              filename: true,
              originalName: true,
              url: true,
              mimeType: true,
              extension: true,
              size: true,
              duration: true,
              width: true,
              height: true,
              altText: true,
              caption: true,
            },
          },
        },
      });

      if (!client) {
        this.logger.warn(`Client with ID "${clientId}" not found`);
        throw new NotFoundException('Client not found');
      }

      return client;
    } catch (error) {
      this.logger.error('Error fetching client by ID', error);
      throw error;
    }
  }

  async createClient(data: CreateClientDto) {
    try {
      const client = await this.prisma.client.create({
        data: {
          name: data.name,
          description: data.description,
          industryId: data.industryId,
          email: data.email,
          phone: data.phone,
          logoId: data.logoId,
        },
      });

      const address = await this.updateClientAddress(client.id, data);

      const res = await this.stakeholdersService.createStakeholder({
        name: data.name,
        organization: data.name,
        email: data.email || '',
        phone: data.phone || '',
        type: 'CLIENT',
      });

      await this.prisma.client.update({
        where: { id: client.id },
        data: {
          addressId: address.id,
          stakeholderId: res.stakeholder.stakeholderId,
        },
      });

      return {
        message: 'Client created successfully',
        client: await this.getClientById(client.id),
        clients: await this.getAllClients(),
      };
    } catch (error) {
      this.logger.error('Error creating client', error);
      throw error;
    }
  }

  async updateClient(data: UpdateClientDto) {
    try {
      const existingClient = await this.getClientById(data.id);

      if (!existingClient) {
        this.logger.warn(`Client with ID "${data.id}" not found`);
        throw new NotFoundException('Client not found');
      }

      await this.prisma.client.update({
        where: { id: data.id },
        data: {
          name: data.name,
          description: data.description,
          industryId: data.industryId,
          logoId: data.logoId,
          email: data.email,
          phone: data.phone,
        },
      });

      await this.updateClientAddress(data.id, data);

      await this.stakeholdersService.updateStakeholder({
        stakeholderId: existingClient.stakeholderId || '',
        name: data.name,
        organization: data.name,
        email: data.email || '',
        phone: data.phone || '',
        type: 'CLIENT',
      });

      return {
        message: 'Client updated successfully',
        client: await this.getClientById(data.id),
        clients: await this.getAllClients(),
      };
    } catch (error) {
      this.logger.error('Error updating client', error);
      throw error;
    }
  }

  async deleteClient(clientId: string) {
    try {
      const existingClient = await this.prisma.client.findUnique({
        where: { id: clientId },
      });

      if (!existingClient) {
        this.logger.warn(`Client with ID "${clientId}" not found`);
        throw new NotFoundException('Client not found');
      }

      await this.prisma.client.delete({
        where: { id: clientId },
      });

      return {
        message: 'Client deleted successfully',
        clients: await this.getAllClients(),
      };
    } catch (error) {
      this.logger.error('Error deleting client', error);
      throw error;
    }
  }

  async updateClientAddress(clientId: string, data: CreateClientDto) {
    try {
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          address: true,
        },
      });

      const address = await this.prisma.clientAddress.upsert({
        where: { id: client?.address?.id || '' },
        create: {
          clientId: clientId,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
        update: {
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      });

      return address;
    } catch (error) {
      this.logger.error('Error updating client address', error);
      throw error;
    }
  }

  async createClientContact(data: CreateClientContactDto) {
    try {
      const existingClient = await this.getClientById(data.clientId);

      if (!existingClient) {
        this.logger.warn(`Client with ID "${data.clientId}" not found`);
        throw new NotFoundException('Client not found');
      }

      const contact = await this.prisma.clientContact.create({
        data: {
          clientId: data.clientId,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          isPrimary: data.isPrimary || false,
        },
      });

      return {
        message: 'Client contact added successfully',
        contact,
      };
    } catch (error) {
      this.logger.error('Error adding client contact', error);
      throw error;
    }
  }

  async updateClientContact(
    contactId: string,
    contactData: CreateClientContactDto,
  ) {
    try {
      const existingContact = await this.prisma.clientContact.findUnique({
        where: { id: contactId },
      });

      if (!existingContact) {
        this.logger.warn(`Client contact with ID "${contactId}" not found`);
        throw new NotFoundException('Client contact not found');
      }

      const updatedContact = await this.prisma.clientContact.update({
        where: { id: contactId },
        data: {
          fullName: contactData.fullName,
          email: contactData.email,
          phone: contactData.phone,
        },
      });

      return {
        message: 'Client contact updated successfully',
        contact: updatedContact,
      };
    } catch (error) {
      this.logger.error('Error updating client contact', error);
      throw error;
    }
  }

  async deleteClientContact(contactId: string) {
    try {
      const existingContact = await this.prisma.clientContact.findUnique({
        where: { id: contactId },
      });

      if (!existingContact) {
        this.logger.warn(`Client contact with ID "${contactId}" not found`);
        throw new NotFoundException('Client contact not found');
      }

      await this.prisma.clientContact.delete({
        where: { id: contactId },
      });

      return { message: 'Client contact deleted successfully' };
    } catch (error) {
      this.logger.error('Error deleting client contact', error);
      throw error;
    }
  }
}
