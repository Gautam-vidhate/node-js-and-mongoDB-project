export interface Book {
  _id: string;
  title: string;
  author: string;
  publishedYear: number;
}

export interface BookFormData {
  title: string;
  author: string;
  publishedYear: number;
}

export interface Statistics {
  totalBooks: number;
  uniqueAuthors: number;
  publicationYears: number;
}