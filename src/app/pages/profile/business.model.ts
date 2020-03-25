export class Business {
  constructor(
    public business_id: string,
    public business_name : string,
    public business_type : string,
    public business_address : string,
    public business_coordinates: string,
    public business_description: string,
    public business_footprint: string,
    public business_level: number,
    public business_county: string,
    public business_town: string,
    public id?: number,
    public updatedAt?: Date,
    public createdAt?: Date,
    public lastUpdatedBy?: string,
  ) { }
}
