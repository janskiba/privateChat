export interface Message {
  content: {
    body: string;
    registratonId?: number;
    type?: number;
  };
  createdAt?: number;
  sender: string;
}
