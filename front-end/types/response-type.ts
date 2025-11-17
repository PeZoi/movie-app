// Generic D cho phép override toàn bộ data type khi cần
// Mặc định D sẽ là { result: T } để giữ backward compatibility
export interface ResponseType<T, D extends { result: T } = { result: T }> {
  data: D | null;
  success: boolean;
  statusCode: number;
  message: string;
}

// Helper type để tạo response type với các trường bổ sung
export type ResponseTypeWithExtraFields<T, ExtraFields extends Record<string, unknown> = Record<string, never>
> = ResponseType<T, { result: T } & ExtraFields>;