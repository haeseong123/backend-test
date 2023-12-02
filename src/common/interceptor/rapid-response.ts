export interface RapidResponse<T> {
  statusCode: number;
  message: string;
  result: T | null;
}
