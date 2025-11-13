export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  isbn?: string;
  publishedYear?: number;
  description?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  isbn?: string;
  publishedYear?: number;
  description?: string;
}