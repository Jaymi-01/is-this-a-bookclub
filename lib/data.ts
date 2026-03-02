export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  dateRead?: string;
  summary?: string;
  rating?: number;
}

export const CURRENT_BOOK: Book = {
  id: "current",
  title: "The Seven Husbands of Evelyn Hugo",
  author: "Taylor Jenkins Reid",
  cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1664458860i/32620332.jpg",
};

export const PAST_BOOKS: Book[] = [
  {
    id: "1",
    title: "Tomorrow, and Tomorrow, and Tomorrow",
    author: "Gabrielle Zevin",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1636978687i/58784477.jpg",
    dateRead: "Jan 2026",
    summary: "A sprawling, deeply felt novel about the beauty and complexity of human connection.",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Yellowface",
    author: "R.F. Kuang",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1671336043i/62047984.jpg",
    dateRead: "Dec 2025",
    summary: "A sharp, satirical thriller that explores the dark side of the publishing industry.",
    rating: 4.5,
  },
  {
    id: "3",
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1602190203i/52578297.jpg",
    dateRead: "Nov 2025",
    summary: "A beautiful exploration of regret and the power of choices.",
    rating: 4.2,
  },
  {
    id: "4",
    title: "Circe",
    author: "Madeline Miller",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1508879575i/35959740.jpg",
    dateRead: "Oct 2025",
    summary: "A feminist reimagining of the Greek myth of the sorceress Circe.",
    rating: 4.9,
  },
  {
    id: "5",
    title: "Lesson in Chemistry",
    author: "Bonnie Garmus",
    cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1650390886i/58065033.jpg",
    dateRead: "Sep 2025",
    summary: "A witty and empowering story about a woman breaking barriers in 1960s science.",
    rating: 4.7,
  }
];
