export class Comment {

  public deleteable: boolean;
  public loop: boolean = false;

  public comment_id;
  public version_id;
  public parent_comment_id;
  public comment_time;
  public name: string;
  public start_time;
  public include_start;
  public end_time;
  public include_end;
  public notes: string;
  public replies: Comment[];

  constructor() {
    this.replies = [];
  }
}

export class CommentSorter {

  public heading: string = "Order by";

  constructor(
    public comparator: (a: Comment, b: Comment) => number,
    public description: string
  ) {
  }

  public static MOST_RECENT: CommentSorter = new CommentSorter(
    (a, b) => {
      if (a.comment_time == b.comment_time) return b.comment_id - a.comment_id;

      return b.comment_time - a.comment_time
    }, "Most recent"
  );

  public static TRACK_TIME: CommentSorter = new CommentSorter(
    (a, b) => {
      if (a.include_start && !b.include_start) return -1;
      if (b.include_start && !a.include_start) return 1;

      if (a.start_time == b.start_time) return b.comment_id - a.comment_id;

      return a.start_time - b.start_time
    }, "Track time"
  );

  public static NAME: CommentSorter = new CommentSorter(
    (a, b) => {
      if (a.name.toLowerCase() == b.name.toLowerCase()) return b.comment_id - a.comment_id;

      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    }, "Name"
  );
}
