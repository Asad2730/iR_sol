import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Task } from 'src/task/schemas/task.schema';


export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;
  
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.Array<Types.ObjectId>;

  @Prop([{ type: Types.ObjectId, ref: 'Task' }])
  tasks:  Types.Array<Types.ObjectId>;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
