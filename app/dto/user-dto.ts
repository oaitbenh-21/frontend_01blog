import { PostResponseDto } from "./post-dto";

export interface AuthorDto {
    id: number;
    username: string;
    avatar: string;
    role: string;
}

export interface UserDto {
    id: number;
    username: string;
    avatar: string;
    email: string;
    role: string;
    bio: string;
    deleted: boolean;
    posts: PostResponseDto[];
}
