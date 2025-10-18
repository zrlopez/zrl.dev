# ZRL.dev - Modern Portfolio Website

> A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Performance Optimized**: Automatic code splitting, image optimization, and caching
- **Responsive Design**: Mobile-first approach with sophisticated breakpoints
- **Dark/Light Mode**: Complete theme switching with system preference detection
- **Interactive Animations**: Smooth scroll-triggered animations with Framer Motion
- **SEO Enhanced**: Comprehensive metadata, Open Graph, and structured data
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels
- **Contact Form**: Functional contact form with validation
- **Project Filtering**: Categorized project showcase with dynamic filtering

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/zrduloup/zrl.dev.git

# Navigate to the project directory
cd zrl.dev

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── sections/       # Page sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── stats.tsx
│   │   ├── skills.tsx
│   │   ├── experience.tsx
│   │   ├── projects.tsx
│   │   └── contact.tsx
│   ├── navigation.tsx  # Header navigation
│   ├── footer.tsx      # Site footer
│   └── theme-provider.tsx # Theme management
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Vercel will automatically deploy your site

### Other Platforms

- **Netlify**: Set build command to `npm run build` and publish directory to `.next`
- **Cloudflare Pages**: Configure with `npm run build` and output directory `.next`

## 🎨 Customization

### Colors & Theme

Customize the color palette in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Your custom colors here
      },
    },
  },
}
```

### Content

Update your personal information in the component files:

- **Personal info**: `src/components/sections/hero.tsx`
- **About section**: `src/components/sections/about.tsx`
- **Experience**: `src/components/sections/experience.tsx`
- **Projects**: `src/components/sections/projects.tsx`

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Zachary Ryan Lopez** | [zrl.dev](https://zrl.dev) | [LinkedIn](https://linkedin.com/in/zrlopez)