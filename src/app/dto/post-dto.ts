import { CommentResponseDto } from "./comment-dto";

export interface PostResponseDto {
  id: number;
  content: string;
  createdAt: string;
  description: string;
  author: {
    id: number;
    username: string;
    avatar: string;
    role: string;
  };
  likes: number;
  likedByCurrentUser: boolean;
  comments: CommentResponseDto[];
}


export interface PostRequestDto {
  content: string;
}

