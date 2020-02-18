export class Business {
  constructor(
    public business_id: string,
    public business_name : string,
    public business_type : string,
    public business_address : string,
    public business_coordinates: string,
    public business_description: string,
    public id?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
  ) { }
}
