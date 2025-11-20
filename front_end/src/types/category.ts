export interface Category {
  _id: string;
  name: string;
  description?: string;
  bookCount?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
}