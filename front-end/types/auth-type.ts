export interface LoginResType {
  data: {
      token: string;
      expiresAt: string;
      account: {
          id: number;
          name: string;
          email: string;
      };
  };
  message: string;
}