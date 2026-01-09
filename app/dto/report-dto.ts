interface ReportDto {
  id?: number;
  reporterId?: number;
  reportedUserId: number;
  reason: string;
  createdAt?: string;
  status?: string;
}