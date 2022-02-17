import {IComment} from "../interfaces/comment.object";

export class Comment implements IComment{
  content: string;
  date: string;
  title: string;
  user_name: string;

  constructor(user_name: string, title:string, content: string, date: string) {
    this.user_name = user_name;
    this.title = title;
    this.content = content;
    this.date = date;
  }
}
