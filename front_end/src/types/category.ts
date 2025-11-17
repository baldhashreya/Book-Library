export interface Category {
  id: string;
  name: string;
  description?: string;
  bookCount?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
}