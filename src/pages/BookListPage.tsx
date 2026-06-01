import React, { useEffect, useMemo, useState } from 'react';
import { IBook, IBookFormData, BookStatus } from '../interfaces/book';
import { storageService } from '../context/storage';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';

const FILTERS: { value: BookStatus | 'hepsi'; label: string; icon: string }[] = [
  { value: 'hepsi', label: 'Tüm Kitaplar', icon: '✦' },
  { value: 'okunuyor', label: 'Okunuyor', icon: '◐' },
  { value: 'okundu', label: 'Okundu', icon: '✓' },
  { value: 'okunacak', label: 'Okunacak', icon: '○' },
  { value: 'favori', label: 'Favoriler', icon: '◆' },
];

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [activeFilter, setActiveFilter] = useState<BookStatus | 'hepsi'>('hepsi');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editBook, setEditBook] = useState<IBook | null>(null);

  useEffect(() => {
    setBooks(storageService.getAll());
  }, []);

  const handleSave = (data: IBookFormData) => {
    if (editBook) {
      const updated = storageService.update(editBook.id, data);
      if (updated) setBooks(prev => prev.map(book => (book.id === editBook.id ? updated : book)));
    } else {
      const newBook = storageService.add(data);
      setBooks(prev => [newBook, ...prev]);
    }
    setEditBook(null);
  };

  const handleEdit = (book: IBook) => {
    setEditBook(book);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu kitabı silmek istediğine emin misin?')) {
      storageService.delete(id);
      setBooks(prev => prev.filter(book => book.id !== id));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditBook(null);
  };

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return books
      .filter(book => activeFilter === 'hepsi' || book.status === activeFilter)
      .filter(book => {
        if (!query) return true;
        return book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
      });
  }, [books, activeFilter, searchQuery]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { hepsi: books.length };
    for (const book of books) result[book.status] = (result[book.status] || 0) + 1;
    return result;
  }, [books]);

  const readCount = counts.okundu || 0;
  const readingCount = counts.okunuyor || 0;
  const favoriteCount = counts.favori || 0;
  const activeTitle = FILTERS.find(filter => filter.value === activeFilter)?.label || 'Kitaplar';
  const progress = books.length > 0 ? Math.round((readCount / books.length) * 100) : 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="brand-mark">K</div>
          <div>
            <h1>Kitaplığım</h1>
            <p>Kişisel okuma arşivi</p>
          </div>
        </div>

        <div className="progress-card">
          <div className="progress-card__top">
            <span>Okuma ilerlemesi</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p>{readCount} kitap tamamlandı, {readingCount} kitap şu anda okunuyor.</p>
        </div>

        <nav className="filter-list" aria-label="Kitap filtreleri">
          {FILTERS.map(filter => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                className={`filter-button ${active ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(filter.value)}
                type="button"
              >
                <span className="filter-button__label">
                  <span className="filter-button__icon">{filter.icon}</span>
                  {filter.label}
                </span>
                <span className="filter-button__count">{counts[filter.value] ?? 0}</span>
              </button>
            );
          })}
        </nav>

        <button className="sidebar-add-button" onClick={() => setIsModalOpen(true)} type="button">
          <span>＋</span> Yeni Kitap Ekle
        </button>
      </aside>

      <main className="main-area">
        <section className="hero-panel">
          <div className="hero-content">
            <span className="eyebrow">Kitap takip paneli</span>
            <h2>Okuma yolculuğunu daha düzenli ve keyifli takip et.</h2>
            <p>Kitaplarını durumlarına göre ayır, favorilerini sakla ve kısa notlarla kendi mini arşivini oluştur.</p>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <span>Toplam</span>
              <strong>{books.length}</strong>
            </div>
            <div className="stat-card">
              <span>Okundu</span>
              <strong>{readCount}</strong>
            </div>
            <div className="stat-card">
              <span>Favori</span>
              <strong>{favoriteCount}</strong>
            </div>
          </div>
        </section>

        <header className="toolbar">
          <div>
            <span className="toolbar-kicker">{activeTitle}</span>
            <h3>{filteredBooks.length} kitap listeleniyor</h3>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Kitap veya yazar ara"
            />
          </div>
        </header>

        {filteredBooks.length === 0 ? (
          <section className="empty-state">
            <div className="empty-state__icon">✧</div>
            <h3>{searchQuery ? 'Aradığın kitap bulunamadı' : 'Kitaplığın henüz boş'}</h3>
            <p>{searchQuery ? 'Farklı bir kitap adı veya yazar deneyebilirsin.' : 'İlk kitabını ekleyerek okuma arşivini oluşturmaya başla.'}</p>
            {!searchQuery && (
              <button className="primary-button" onClick={() => setIsModalOpen(true)} type="button">
                İlk Kitabımı Ekle
              </button>
            )}
          </section>
        ) : (
          <section className="book-grid">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </section>
        )}
      </main>

      <BookModal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleSave} editBook={editBook} />
    </div>
  );
};

export default BookListPage;
