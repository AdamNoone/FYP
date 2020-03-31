export class Post {
  constructor(
    public title: string,
    public description: string,
    public picture: string,
    public business: string,
    public business_address: string,
    public business_name: string,
    public ingredients:string,
    public carbon_footprint:number,
    public portion: number,
    public price:string,
    public collection_time:string,
    public id?: number,
    public updated_at?: Date,
    public created_at?: Date,
    public last_updated_by?: string,
  ) { }
}
