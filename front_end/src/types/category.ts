

export interface CategoryFormData {
  name: string;
  description: string;
  status: "ACTIVE" | "IN_ACTIVE"
}

export interface Category extends CategoryFormData {
  _id: string;
  bookCount?: number;
}