export class User {
  constructor(
    public user_id: string,
    public user_email : string,
    public user_name : string,
    public user_address : string,
    public user_coordinates: string,
    public user_footprint: string,
    public user_level: number,
    public id?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
  ) { }
}
