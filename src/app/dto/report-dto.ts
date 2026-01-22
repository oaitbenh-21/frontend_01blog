export interface ReportDto {
  id: number;
  reporterId: number;
  reportedUserId: number;
  reason: string;
  createdAt: string;
  status: string;
}

export interface ReportRequestDto {
  postid: number;
  userid: number;
  reason: string;
}
