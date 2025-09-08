// src/app/features/models/post.model.ts
export interface Comment {
  user: string;
  text: string;
  createdAt?: string;
}

export interface PostUser {
  name: string;
  avatarUrl: string;
  userId?: string;
  following?: boolean;
}

export interface Post {
  // del backend:
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  likedBy?: string[];
  savedBy?: string[];

  // comunes:
  id: string;                
  user: PostUser;
  imageUrl: string;
  caption?: string;
  likesCount: number;
  comments: Comment[];

  // campos de UI
  liked?: boolean;
  saved?: boolean;
}
