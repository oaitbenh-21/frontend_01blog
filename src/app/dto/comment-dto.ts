import { AuthorDto } from "./user-dto";

export interface CommentRequestDto {
    content: string;
}

export interface CommentResponseDto {
    content: string;
    author: AuthorDto;
}