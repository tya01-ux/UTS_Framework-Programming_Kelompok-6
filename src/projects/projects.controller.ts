import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  // membuat endpoint untuk membuat project baru
  @Post() 
  @ApiOperation({ summary: 'Membuat project baru' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }
  // membuat endpoint untuk menampilkan semua project
  @Get()
  @ApiOperation({ summary: 'Menampilkan semua project' })
  findAll() {
    return this.projectsService.findAll();
  }
  // membuat endpoint untuk menampilkan detail project berdasarkan id
  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail project' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }
  // membuat endpoint untuk mengubah project berdasarkan id
  @Patch(':id')
  @ApiOperation({ summary: 'Mengubah project' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }
  // membuat endpoint untuk menghapus project berdasarkan id
  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus project' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}