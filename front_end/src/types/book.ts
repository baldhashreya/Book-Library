export const BookStatusEnum = {
  AVAILABLE: "AVAILABLE",
  CHECKED_OUT: "CHECKED_OUT",
  RESERVED: "RESERVED",
  LOST: "LOST",
} as const;

export type BookStatusEnum =
  (typeof BookStatusEnum)[keyof typeof BookStatusEnum];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: BookStatusEnum;
  isbn?: string;
  publishedYear?: number;
  description?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  status: BookStatusEnum;
  isbn?: string;
  publishedYear?: number;
  description?: string;
}
