# Reactors 

A simple web app to track and manage books. Built with React + Vite + Tailwind.

## Team
- Ali Khalifeh : Homepage - Add & Edit
- Jawad Taki : Login - register
- Hussein Sabra : Book Listing - Book details
- Ali Daouk : Profile - Reading List

## Live Link 


## Primary Data entities 
- Book
- User
## Features
- Browse and explore books
- Add and edit book entries
- Build and manage your reading list
- User login and profile management
- Local/session storage support

## Tech Stack
- **React 18**
- **Vite**
- **React Router DOM**
- **Tailwind CSS**

## Setup
1. Clone the repository  
  
   git clone https://github.com/alikhalifehh/Reactors.git

2. Go Inside the Project Folder

    cd Reactors

3. Install Dependencies

    npm install

4. Start the Development Server

    npm run dev

## How mock data is used 
   
    All book information is stored locally in the file  
    `src/data/books.js`.

    Each book is an object with properties such as **title**, **author**, **year**, **genre**, **description**, and **cover image**.  
    This file acts like a small local database and lets the app work without connecting to a real backend.

    The app also uses **BookContext** (`src/context/BookContext.jsx`) to simulate backend actions.  
    Functions like `addBook`, `updateBook`, and `deleteBook` act the same way as API requests would — they update the local state instead of sending data to a server.

    This setup allows the app to feel fully functional even though it’s running only on mock data.

## Key Features 


- **View and Explore Books**  
  Users can browse a list of books with details like title, author, genre, and cover.

- **Book Details Page**  
  Each book has its own page showing a full description and related information.

- **Add & Edit Books**  
  Users can add new books or update existing ones easily through a simple form.

- **Reading List Management**  
  Users can keep track of what they’re reading, what they’ve completed, and what they plan to read.

- **User Profile**  
  Displays user information and reading progress.

- **Login & Register**  
  Simple authentication flow for users (mocked locally for demo purposes).

- **Home Page Carousel**  
  The homepage includes a rotating background and featured books section.

- **Mock Data Simulation**  
  The app runs entirely on mock data (no backend required), simulating real app interactions.

- **Modern UI & Smooth Animations**  
  Built with React, TailwindCSS, and Framer Motion for a smooth, user-friendly experience.
