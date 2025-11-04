import { createContext, useState } from "react";

export const BookContext = createContext();

export function BookContextProvider({ children }) {
  const [books, setBooks] = useState([]);

  const addBook = (newBook) => setBooks((prev) => [...prev, newBook]);
  const updateBook = (id, updatedBook) =>
    setBooks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedBook } : b))
    );
  const deleteBook = (id) =>
    setBooks((prev) => prev.filter((b) => b.id !== id));

  return (
    <BookContext.Provider value={{ books, addBook, updateBook, deleteBook }}>
      {children}
    </BookContext.Provider>
  );
}
