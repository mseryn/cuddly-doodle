
import { Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../user/user.model";
import { TaskDefinition } from "./task-definition.model";

@Table({ modelName: 'userTaskDefinition', tableName: 'userTaskDefinition' })
export class UserTaskDefinition extends Model {
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
}