export class Comment {

  public comment_id;
  public version_id;
  public parent_comment_id;
  public comment_time;
  public name: string;
  public start_time;
  public include_start: boolean;
  public end_time;
  public include_end: boolean;
  public notes: string;
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
    (a, b) => b.comment_time - a.comment_time,
    "Most Recent First"
  );

  public static MOST_RECENT_LAST: CommentSorter = new CommentSorter(
    (a, b) => a.comment_time - b.comment_time,
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
