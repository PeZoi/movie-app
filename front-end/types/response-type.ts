export interface ResponseType<T> {
  data: {
    result: T;
  };
  success: boolean;
  statusCode: number;
  message: string;
}