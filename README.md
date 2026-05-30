# ZRL.dev - Modern Portfolio Website

![Status](https://img.shields.io/badge/status-live-brightgreen)
![Stack](https://img.shields.io/badge/stack-Next.js%20%2B%20TypeScript%20%2B%20Tailwind-0A66C2)
![CI](https://github.com/zrlopez/zrl.dev/actions/workflows/secured_ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/zrlopez/zrl.dev/branch/main/graph/badge.svg)](https://codecov.io/gh/zrlopez/zrl.dev)
![License](https://img.shields.io/badge/license-MIT-blue)

> A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## 🌐 Live Demo

- [zrl.dev](https://zrl.dev) — view the portfolio online.
- [Annotation Analytics Dashboard](https://zrl.dev/projects/annotation-dashboard) — featured project demo.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Performance Optimized**: Automatic code splitting, image optimization, and caching
- **Responsive Design**: Mobile-first approach with sophisticated breakpoints
- **Dark/Light Mode**: Complete theme switching with system preference detection
- **Interactive Animations**: Smooth scroll-triggered animations with Framer Motion
- **SEO Enhanced**: Comprehensive metadata, Open Graph, and structured data
- **Accessibility**: Semantic HTML with proper ARIA labels
- **Contact Form**: Functional contact form with Resend email API and Cloudflare Turnstile spam protection
- **Project Pages**: Dedicated detail pages per project (e.g. Annotation Analytics Dashboard)

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Email**: [Resend](https://resend.com/)
- **Spam Protection**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/zrlopez/zrl.dev.git

# Navigate to the project directory
cd zrl.dev

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout with metadata
│   ├── page.tsx                          # Homepage
│   ├── globals.css                       # Global styles
│   └── projects/
│       └── annotation-dashboard/         # Project detail page
├── components/
│   ├── sections/                         # Page sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   ├── stats.tsx
│   │   ├── skills.tsx
│   │   ├── experience.tsx
│   │   ├── projects.tsx
│   │   └── contact.tsx
│   ├── navigation.tsx                    # Header navigation
│   ├── footer.tsx                        # Site footer
│   └── theme-provider.tsx                # Theme management
public/
├── certs/                                # Certification images
└── resume.pdf                            # Downloadable résumé
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Add environment variables in the Vercel project settings
4. Vercel will automatically deploy your site

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
- **Annotation Analytics Dashboard**: `src/app/projects/annotation-dashboard/`

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**© 2026 Zachary Ryan Lopez. All rights reserved.** | [zrl.dev](https://zrl.dev) | [LinkedIn](https://linkedin.com/in/zrlopez)
