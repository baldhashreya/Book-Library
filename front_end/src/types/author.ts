export interface Author {
    _id: string;
    name: string;
    bio: string;
    birthDate: Date;
}

export interface AuthorFormData {
  name: string;
  bio: string;
  birthDate: Date | string;
}