export interface PostResponseDto {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    avatar: string;
    role: string;
  };
  likes: number;
  likedByCurrentUser: boolean;
  comments: {
    content: string;
    author: {
      id: number;
      username: string;
      avatar: string;
      role: string;
    };
  }[];
}
