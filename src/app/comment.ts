export class Comment {

  public id;
  public version_id;
  public parent_id;
  public time;
  public name: string;
  public tag: string;
  public start;
  public end;
  public text: string;
  public replies: Comment[];

  constructor() {
  }
}

export class CommentSorter {

  constructor(
    public comparator: (a: Comment, b: Comment) => number,
    public description: string
  ) {
  }

  public static MOST_RECENT_FIRST: CommentSorter = new CommentSorter(
    (a, b) => b.time - a.time,
    "Most Recent First"
  );

  public static MOST_RECENT_LAST: CommentSorter = new CommentSorter(
    (a, b) => a.time - b.time,
    "Most Recent Last"
  );

  public static NAME_A_Z: CommentSorter = new CommentSorter(
    (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0,
    "Name A-Z"
  );

  public static NAME_Z_A: CommentSorter = new CommentSorter(
    (a, b) => b.name.toLowerCase() > a.name.toLowerCase() ? 1 : 0,
    "Name Z-A"
  );
}
