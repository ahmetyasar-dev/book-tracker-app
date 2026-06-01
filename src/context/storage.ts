import { IBook, IBookFormData } from '../interfaces/book';

const STORAGE_KEY = 'kitap-takip-books';

export const storageService = {
  getAll(): IBook[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(books: IBook[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  },

  add(formData: IBookFormData): IBook {
    const books = storageService.getAll();
    const newBook: IBook = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    storageService.save([...books, newBook]);
    return newBook;
  },

  update(id: string, formData: Partial<IBookFormData>): IBook | null {
    const books = storageService.getAll();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...formData };
    storageService.save(books);
    return books[index];
  },

  delete(id: string): void {
    const books = storageService.getAll().filter((b) => b.id !== id);
    storageService.save(books);
  },
};
