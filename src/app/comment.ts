export class Comment {

  constructor(
    public name?: string, public tag?: string, public start?, public end?, public text?: string, public replies?: Comment[]
  ) {
  }
}
