import { AuthorDto } from "./user-dto";

export interface CommentRequestDto {
    content: string;
}

export interface CommentResponseDto {
    id: number;
    content: string;
    author: AuthorDto;
    mine?: boolean;
}