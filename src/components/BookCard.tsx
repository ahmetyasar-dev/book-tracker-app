import React from 'react';
import { IBook, BookStatus } from '../interfaces/book';

interface BookCardProps {
  book: IBook;
  onEdit: (book: IBook) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<BookStatus, { label: string; className: string; icon: string }> = {
  okunuyor: { label: 'Okunuyor', className: 'status-reading', icon: '◐' },
  okundu: { label: 'Okundu', className: 'status-read', icon: '✓' },
  okunacak: { label: 'Okunacak', className: 'status-wishlist', icon: '○' },
  favori: { label: 'Favori', className: 'status-favorite', icon: '◆' },
};

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const status = statusConfig[book.status];
  const initials = book.author
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="book-card">
      <div className="book-card__cover" aria-hidden="true">
        <span>{book.title.charAt(0).toUpperCase()}</span>
      </div>

      <div className="book-card__body">
        <div className="book-card__meta">
          <span className={`status-pill ${status.className}`}>
            <span>{status.icon}</span> {status.label}
          </span>
          {book.rating > 0 && (
            <div className="rating" aria-label={`${book.rating} puan`}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= book.rating ? 'is-filled' : ''}>★</span>
              ))}
            </div>
          )}
        </div>

        <h3 className="book-card__title line-clamp-2">{book.title}</h3>

        <div className="author-row">
          <span className="author-avatar">{initials || 'Y'}</span>
          <span className="line-clamp-1">{book.author}</span>
        </div>

        {book.notes ? (
          <p className="book-note line-clamp-3">“{book.notes}”</p>
        ) : (
          <p className="book-note book-note--empty">Bu kitap için henüz not eklenmedi.</p>
        )}

        <div className="book-card__actions">
          <button className="ghost-button" onClick={() => onEdit(book)} type="button">Düzenle</button>
          <button className="danger-button" onClick={() => onDelete(book.id)} type="button">Sil</button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
