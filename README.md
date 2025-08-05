# PokéNest: Discover & Collect Pokémon

PokéNest is a modern web application that allows users to discover Pokémon from the vast Pokémon universe, view their stats, and manage their own personal collection. This project is built with a modern tech stack, focusing on a clean user interface and a smooth user experience.

![PokéNest Screenshot](https://via.placeholder.com/800x400.png?text=PokéNest+Application+Screenshot)
_(Replace with an actual screenshot of the application)_

## ✨ Features

- **Pokémon Discovery**: Infinitely scroll through a list of Pokémon, loading more as you go.
- **Detailed Views**: Click on any Pokémon to see a detailed card with its name, image, types, and base stats (HP, Attack, Defense).
- **Personal Collection**: Add your favorite Pokémon to a personal collection.
- **Collection Management**: View all collected Pokémon on a dedicated page.
- **Drag & Drop Reordering**: Easily reorder the Pokémon in your collection using drag and drop.
- **Persistent Storage**: Your collection is saved in your browser's local storage, so it persists across sessions.
- **Responsive Design**: A clean, glassmorphism-style UI that works on all screen sizes.
- **Toast Notifications**: Get feedback on actions like adding or removing Pokémon.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Query](https://tanstack.com/query/v5) for server state management and caching.
- **Routing**: [React Router](https://reactrouter.com/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/pokenest.git
    cd pokenest
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Then, open the `.env` file and add the required values:

    ```
    VITE_BASE_URL=https://pokeapi.co/api/v2
    VITE_STORAGE_KEY=pokemonCollection
    ```

4.  **Run the development server:**
    ```bash
    pnpm run dev
    ```
    The application should now be running on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## 📜 Available Scripts

In the project directory, you can run:

- `pnpm run dev`: Runs the app in development mode.
- `pnpm run build`: Builds the app for production to the `dist` folder.
- `pnpm run lint`: Lints the codebase using ESLint.
- `pnpm run preview`: Serves the production build locally for preview.

## 📁 Folder Structure

Here's an overview of the project's directory structure:

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images and SVGs
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages (Discovery, Collection)
│   ├── services/        # API and localStorage interaction
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component with routing
│   ├── main.tsx         # Entry point of the application
│   └── index.css        # Global styles
├── .env.example         # Example environment variables
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite configuration
```

---
