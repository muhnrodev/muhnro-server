import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  CreateClientContactDto,
  CreateClientDto,
  UpdateClientDto,
} from './client.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async getAllClients() {
    return this.clientService.getAllClients();
  }

  @Get('id/:clientId')
  async getClientById(@Param('clientId') clientId: string) {
    return this.clientService.getClientById(clientId);
  }

  @Post()
  async createClient(@Body() data: CreateClientDto) {
    return this.clientService.createClient(data);
  }

  @Put()
  async updateClient(@Body() data: UpdateClientDto) {
    return this.clientService.updateClient(data);
  }

  @Delete(':clientId')
  async deleteClient(@Param('clientId') clientId: string) {
    return this.clientService.deleteClient(clientId);
  }

  @Post('contact')
  async addClientContact(@Body() data: CreateClientContactDto) {
    return this.clientService.createClientContact(data);
  }

  @Put('contact')
  async updateClientContact(@Body() contactData: CreateClientContactDto) {}
}
