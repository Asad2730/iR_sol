import { IsArray, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'New Website Redesign' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: ['60f8eae2f5d5e35d88e04d90', '60f8eae2f5d5e35d88e04d91'],
    description: 'Array of User IDs who are members of the project',
  })
  @IsArray()
  @IsMongoId({ each: true })
  members: string[];

  @ApiProperty({
    example: ['60f8eae2f5d5e35d88e04d93', '60f8eae2f5d5e35d88e04d94'],
    description: 'Array of Task IDs associated with the project',
  })
  @IsArray()
  @IsMongoId({ each: true })
  tasks: string[];
}
