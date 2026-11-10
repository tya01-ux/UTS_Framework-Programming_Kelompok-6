import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  private validateDates(start?: string | Date, end?: string | Date) {
    if (start && end && new Date(end) < new Date(start)) {
      throw new BadRequestException(
        'end_date tidak boleh sebelum start_date',
      );
    }
  }

  async create(dto: CreateProjectDto) {
    this.validateDates(dto.start_date, dto.end_date);

    const project = this.projectRepository.create(dto);
    return await this.projectRepository.save(project);
  }

  async findAll() {
    return await this.projectRepository.find({
      relations: {
        projectMembers: { member: true },
        tasks: true,
        files: true,
      },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: {
        projectMembers: { member: true },
        tasks: true,
        files: true,
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project dengan ID ${id} tidak ditemukan`,
      );
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto) {
    const project = await this.findOne(id);

    this.validateDates(
      dto.start_date ?? project.start_date,
      dto.end_date ?? project.end_date,
    );

    Object.assign(project, dto);

    return await this.projectRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    await this.projectRepository.remove(project);

    return {
      message: 'Project berhasil dihapus',
    };
  }
}