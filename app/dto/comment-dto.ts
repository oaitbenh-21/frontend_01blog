interface CommentRequestDto {
    content: string;
}

interface CommentResponseDto {
    content: string;
    author: AuthorDto;
}