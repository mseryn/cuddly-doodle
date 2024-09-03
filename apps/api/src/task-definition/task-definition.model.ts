import { AllowNull, BelongsTo, BelongsToMany, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, HasMany, HasOne, Model, NotNull, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { User } from "../user/user.model";
import { Task } from "../task/task.model";
import { UserTaskDefinition } from "./userTaskDefinition.model";
import ImageModel from "../image/image.model";

@Table({ modelName: 'taskdefinition', tableName: 'taskdefinition', paranoid: true, timestamps: true }) 
export class TaskDefinition extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  name: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  description: string;

  @Column({ type: DataType.STRING })
  deifnition: string;

  @Default(0)
  @Column({ type: DataType.FLOAT })
  value: number;

  @ForeignKey(() => ImageModel)
  @Column({ type: DataType.UUID })
  imageId: string;

  @BelongsTo(() => ImageModel)
  image: ImageModel;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt?: Date;

  @DeletedAt
  @Column({ type: DataType.DATE })
  deletedAt?: Date;

  @HasMany(() => Task)
  tasks: Task[];

  @BelongsToMany(() => User, () => UserTaskDefinition)
  users: User[];
}