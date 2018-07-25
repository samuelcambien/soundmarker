export class Comment {

  public id;
  public version_id;
  public parent_id;
  public name: string;
  public tag: string;
  public start;
  public end;
  public text: string;
  public replies: Comment[];

  constructor() { }
}
