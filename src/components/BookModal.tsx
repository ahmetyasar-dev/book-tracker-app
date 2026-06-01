import React, { useEffect, useState } from 'react';
import { IBook, IBookFormData, BookStatus } from '../interfaces/book';

interface BookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IBookFormData) => void;
  editBook?: IBook | null;
}

const statusOptions: { value: BookStatus; label: string }[] = [
  { value: 'okunacak', label: 'Okunacak' },
  { value: 'okunuyor', label: 'Okunuyor' },
  { value: 'okundu', label: 'Okundu' },
  { value: 'favori', label: 'Favori' },
];

const emptyForm: IBookFormData = {
  title: '',
  author: '',
  rating: 0,
  notes: '',
  status: 'okunacak',
};

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, editBook }) => {
  const [form, setForm] = useState<IBookFormData>(emptyForm);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setForm(
      editBook
        ? {
            title: editBook.title,
            author: editBook.author,
            rating: editBook.rating,
            notes: editBook.notes,
            status: editBook.status,
          }
        : emptyForm,
    );
    setHoverRating(0);
  }, [editBook, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="book-modal">
        <div className="book-modal__header">
          <div>
            <span className="modal-kicker">{editBook ? 'Kitap düzenleme' : 'Yeni kayıt'}</span>
            <h2>{editBook ? 'Kitabı Düzenle' : 'Kitap Ekle'}</h2>
            <p>{editBook ? 'Kitap bilgilerini güncelle.' : 'Okuma listene yeni bir kitap kaydet.'}</p>
          </div>
          <button className="modal-close" onClick={onClose} type="button" aria-label="Kapat">×</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <label>
            <span>Kitap Adı *</span>
            <input
              type="text"
              value={form.title}
              onChange={event => setForm({ ...form, title: event.target.value })}
              placeholder="Örn: Suç ve Ceza"
              required
            />
          </label>

          <label>
            <span>Yazar *</span>
            <input
              type="text"
              value={form.author}
              onChange={event => setForm({ ...form, author: event.target.value })}
              placeholder="Örn: Fyodor Dostoyevski"
              required
            />
          </label>

          <div className="form-row">
            <label>
              <span>Durum</span>
              <select
                value={form.status}
                onChange={event => setForm({ ...form, status: event.target.value as BookStatus })}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <div className="rating-field">
              <span>Puan</span>
              <div className="rating-picker">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setForm({ ...form, rating: star === form.rating ? 0 : star })}
                    className={star <= (hoverRating || form.rating) ? 'is-selected' : ''}
                    aria-label={`${star} puan`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label>
            <span>Notlar</span>
            <textarea
              value={form.notes}
              onChange={event => setForm({ ...form, notes: event.target.value })}
              placeholder="Kitap hakkında kısa bir not yaz..."
              rows={4}
            />
          </label>

          <div className="modal-actions">
            <button className="secondary-button" onClick={onClose} type="button">İptal</button>
            <button className="primary-button" type="submit">{editBook ? 'Güncelle' : 'Kitap Ekle'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
