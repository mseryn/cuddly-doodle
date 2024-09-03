import { Column, DataType, Default, PrimaryKey, Table, Model, BelongsTo, BelongsToMany, ForeignKey } from "sequelize-typescript";
import { Task } from "../task/task.model";
import { UserTaskDefinition } from "../task-definition/userTaskDefinition.model";
import { TaskDefinition } from "../task-definition/task-definition.model";
import { ApiProperty } from "@nestjs/swagger";
import ImageModel from "../image/image.model";

@Table({ modelName: 'user', tableName: 'user' })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @Column({ type: DataType.STRING })
  name: string;

  @ForeignKey(() => ImageModel)
  @Column({ type: DataType.UUID })
  image: string;

  @BelongsTo(() => ImageModel)
  Image: ImageModel;

  @BelongsToMany(() => TaskDefinition, () => UserTaskDefinition)
  TaskDefinitions: TaskDefinition[];
}