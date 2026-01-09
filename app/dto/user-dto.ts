interface AuthorDto {
    id: number;
    username: string;
    avatar: string;
    role: string;
}

interface UserDto {
    id: number;
    username: string;
    avatar: string;
    email: string;
    role: string;
    deleted: boolean;
}