import { AuthorDto } from "./user-dto";

interface CommentRequestDto {
    content: string;
}

interface CommentResponseDto {
    content: string;
    author: AuthorDto;
}