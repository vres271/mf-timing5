import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RacesService } from './races.service';
import { CreateRaceDto } from './dto/create-race.dto';
import { UpdateRaceDto } from './dto/update-race.dto';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('races')
@UseGuards(RolesGuard)
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  @Post()
  create(@Body() createRaceDto: CreateRaceDto) {
    return this.racesService.create(createRaceDto);
  }

  @Get()
  findAll() {
    return this.racesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.racesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRaceDto: UpdateRaceDto,
  ) {
    return this.racesService.update(id, updateRaceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.racesService.remove(id);
  }
}
