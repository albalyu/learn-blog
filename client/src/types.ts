export interface IUser {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  posts?: IPost[];
  comments?: IComment[];
  following?: IUser[];
  subscribers?: IUser[];
}

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: IUser;
  comments?: IComment[];
  tags?: ITag[];
}

export interface IComment {
  id: number;
  content: string;
  createdAt: string;
  author: IUser;
  post: IPost;
}

export interface ITag {
  id: number;
  name: string;
  posts?: IPost[];
}
