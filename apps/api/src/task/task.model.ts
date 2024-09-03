import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { TaskDefinition } from "../task-definition/task-definition.model";

@Table({ modelName: 'task', tableName: 'task' })
export class Task extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;
  
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @ForeignKey(() => TaskDefinition)
  @Column({ type: DataType.UUID })
  taskDefinitionId: string;

  @Column({ type: DataType.DATE })
  date: Date;

  @Column({ type: DataType.BOOLEAN })
  done: boolean;

  @BelongsTo(() => User)
  User: User;

  @BelongsTo(() => TaskDefinition)
  TaskDefinition: TaskDefinition;
}