# ðŸš€ DevOps Engineer Portfolio - Kunal

A modern, high-performance portfolio website built for a DevOps Engineer & SRE. This project showcases reliability, automation, and cloud expertise with a terminal-themed UI and sleek animations.

![Portfolio Preview](public/preview.png)
*(Note: You can add a screenshot of your site to the public folder and name it preview.png)*

## ðŸ› ï¸  Tech Stack

- **Frontend Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Modern CSS3 (Variables, Flexbox, Grid, Animations)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [GitHub Actions](https://github.com/features/actions) / [Vercel](https://vercel.com/) (Recommended)

---

## ðŸ’¾ How to Run on a New Laptop

Follow these steps to set up and run the project on a different machine.

### 1. Prerequisites

Make sure you have the following installed on your system:
- **Node.js**: [Download here](https://nodejs.org/) (Version 18+ recommended)
- **Git**: [Download here](https://git-scm.com/)

### 2. Clone or Copy the Project

If the project is on GitHub:
```bash
git clone <your-repository-url>
cd kunal_portfolio
```

If you copied the folder manually, just open your terminal and `cd` into the folder:
```bash
cd path/to/kunal_portfolio
```

### 3. Install Dependencies

Run the following command to install all the necessary libraries:
```bash
npm install
```

### 4. Start the Development Server

To run the website locally:
```bash
npm run dev
```
- The terminal will show a local URL (usually `http://localhost:5173/`).
- Open that link in your browser to view the site.

---

## ðŸš¢ Build for Production

To optimize the application for deployment:

```bash
npm run build
```

To preview the built version locally:
```bash
npm run preview
```

---

## ðŸ“‚ Project Structure

```
kunal_portfolio/
â”œâ”€â”€ public/              # Static assets (images, icons)
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/      # React components (Hero, About, Skills, etc.)
â”‚   â”œâ”€â”€ App.tsx          # Main application component
â”‚   â”œâ”€â”€ main.tsx         # Entry point
â”‚   â””â”€â”€ index.css        # Global styles
â”œâ”€â”€ package.json         # Project dependencies and scripts
â”œâ”€â”€ tsconfig.json        # TypeScript configuration
â””â”€â”€ vite.config.ts       # Vite configuration
```

## ðŸ¤— Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Author**: Kunal Singh
**Contact**: kunalsingh2703@gmail.com
