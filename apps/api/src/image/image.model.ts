import { Column, DataType, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table({ modelName: 'image', tableName: 'image' })
export default class ImageModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.BLOB('long'))
  data: Buffer;

  @Unique
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  mimetype: string;
}