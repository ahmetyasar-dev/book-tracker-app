export type BookStatus = 'okunuyor' | 'okundu' | 'okunacak' | 'favori';

export interface IBook {
  id: string;
  title: string;
  author: string;
  rating: number; // 0-5
  notes: string;
  status: BookStatus;
  createdAt: string;
}

export interface IBookFormData {
  title: string;
  author: string;
  rating: number;
  notes: string;
  status: BookStatus;
}
