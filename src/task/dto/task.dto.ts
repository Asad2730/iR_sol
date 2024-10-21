import { IsEnum, IsNotEmpty, IsDateString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Design new homepage layout' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2024-10-30' })
  @IsDateString()
  @IsNotEmpty()
  dueDate: Date;

  @ApiProperty({ example: 'To Do', enum: ['To Do', 'In Progress', 'Completed'] })
  @IsEnum(['To Do', 'In Progress', 'Completed'], { message: 'Status must be one of the following: To Do, In Progress, Completed' })
  status: string;

  @ApiProperty({ example: '5f8d04b8b54764421b7156f3' })
  @IsMongoId()
  @IsNotEmpty()
  assignedTo: string;

  
  @ApiProperty({ example: '5f8d04b8b54764421b7156f4' })
  @IsMongoId()
  @IsNotEmpty()
  project: string; 
}
