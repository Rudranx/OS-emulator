# Operating Systems Visualization Project

A modern web application for visualizing and simulating operating system concepts and algorithms. Built with React and Vite, this project aims to provide an interactive learning experience for understanding complex OS concepts.

## 🌐 Live Demo

Visit the live application: [OS Visualization Project](https://os-orcin-chi.vercel.app/)

## 🚀 Features

- Interactive OS concept visualizations
- Real-time algorithm simulations
- Responsive and modern UI design
- Educational content integration
- Dynamic graph visualizations using React Force Graph

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Routing:** React Router DOM
- **Visualization:** React Force Graph
- **Code Highlighting:** React Syntax Highlighter
- **Icons:** Heroicons, Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd OS
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```



## 🏗️ Building for Production

To create a production build:

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

## 🚀 Deployment

This project is configured for deployment on Vercel. The deployment configuration is handled through `vercel.json` in the frontend directory.

To deploy:
1. Push your changes to your repository
2. Connect your repository to Vercel
3. Vercel will automatically detect the project settings and deploy

## 📁 Project Structure

```
OS/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── assets/       # Static assets
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── public/           # Static files
│   ├── vercel.json       # Vercel deployment configuration
│   └── package.json      # Project dependencies and scripts
└── README.md            # Project documentation
```

