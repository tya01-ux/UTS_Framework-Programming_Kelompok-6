import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectMembersController } from './project-members.controller';
import { ProjectMembersService } from './project-members.service';
import { ProjectMember } from './entities/project-member.entity';
import { Project } from '../projects/entities/project.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectMember, Project, Member]),
  ],  
  
  // Mendaftarkan controller untuk menangani endpoint project-member
  controllers: [ProjectMembersController],
    
  // Mendaftarkan service agar dapat digunakan oleh controller
  providers: [ProjectMembersService],
})
export class ProjectMembersModule {}