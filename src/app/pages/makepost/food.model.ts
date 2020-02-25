export class Food {
  constructor(
    public food_name: string,
    public food_cf : string,
    public food_group : string,
    public id?: number,
    public updatedAt?: Date,
    public updatedBy?: string,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
  ) { }
}
