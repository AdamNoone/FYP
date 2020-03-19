export class Post {
  constructor(
    public title: string,
    public description: string,
    public picture: string,
    public business: string,
    public ingredients:string,
    public carbon_footprint:number,
    public portion: number,
    public id?: number,
    public updated_at?: Date,
    public created_at?: Date,
    public last_updated_by?: string,
  ) { }
}
