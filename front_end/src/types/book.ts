export const BookStatusEnum = {
  AVAILABLE: "AVAILABLE",
  CHECKED_OUT: "CHECKED_OUT",
  RESERVED: "RESERVED",
  LOST: "LOST",
} as const;

export type BookStatusEnum =
  (typeof BookStatusEnum)[keyof typeof BookStatusEnum];

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  status: BookStatusEnum;
  isbn?: string;
  publisher?: number;
  description?: string;
  quantity: number;

}

export interface Book extends BookFormData{
  _id: string;
}