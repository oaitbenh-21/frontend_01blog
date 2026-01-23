import { CommentResponseDto } from "./comment-dto";

export interface PostResponseDto {
  id: number;
  content: string;
  CDate: string;
  description: string;
  author: {
    id: number;
    username: string;
    avatar: string;
    role: string;
  };
  fileUrl: string[];
  likes: number;
  likedByCurrentUser: boolean;
  comments: CommentResponseDto[];
  visible: boolean;
}


export interface PostRequestDto {
  content: string;
}

