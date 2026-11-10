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

import { ProjectMembersService } from './project-members.service';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';

@ApiTags('Project Members')
@Controller('project-members')
export class ProjectMembersController {
  constructor(
    private readonly projectMembersService: ProjectMembersService,
  ) {}

  // Endpoint POST untuk menambahkan relasi member ke dalam project
  @Post()
  @ApiOperation({ summary: 'Menambahkan member ke project' })
  create(@Body() dto: CreateProjectMemberDto) {
    return this.projectMembersService.create(dto);
  }

  // Endpoint GET untuk mengambil seluruh data relasi project-member
  @Get()
  @ApiOperation({ summary: 'Menampilkan semua relasi project-member' })
  findAll() {
    return this.projectMembersService.findAll();
  }

  // Endpoint GET berdasarkan ID untuk mengambil detail project-member
  @Get(':id')
  @ApiOperation({ summary: 'Menampilkan detail project-member' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectMembersService.findOne(id);
  }

  // Endpoint PATCH berdasarkan ID untuk mengubah data project-member
  @Patch(':id')
  @ApiOperation({ summary: 'Mengubah relasi project-member' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectMemberDto,
  ) {
    return this.projectMembersService.update(id, dto);
  }

  // Endpoint DELETE berdasarkan ID untuk menghapus data project-member
  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus relasi project-member' })
  remove(@Param('id', ParseIntPipe) id: number) {
      // Memanggil service untuk menghapus data berdasarkan ID
    return this.projectMembersService.remove(id);
  }
}