import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';
import { User } from 'src/user/schemas/user.schema';


export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: User;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Project;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
