# 🎂 Happy Birthday Keiza - Interactive Celebration Web

A personalized, interactive, and cinematic web application created for a special birthday celebration. This project features a unique storytelling approach through a simulated WhatsApp chat, a relationship counter, a memory scrapbook, and a romantic atmosphere powered by music and animations.

## ✨ Features

- **🔒 PIN Protection:** Secured with a secret PIN (`2308`) to keep the surprise exclusive.
- **🎬 Cinematic Intro:** A smooth, text-based introduction to set the mood.
- **📱 WhatsApp Chat Simulation:** An interactive mock WhatsApp experience where the user "chats" and reminisces about memories.
- **🧩 Love Quiz:** A fun interactive quiz to test knowledge about the relationship.
- **⏳ Relationship Counter:** A live counter showing the exact time spent together since August 23, 2025.
- **📸 Memory Scrapbook:** A beautiful parallax-style section showcasing photos and shared moments.
- **🎵 Music Integration:** Plays "Perfect" by Ed Sheeran in the background to enhance the experience.
- **🎉 Celebration Effects:** Uses `canvas-confetti` for a festive final touch.
- **📱 QR Code Generator:** Built-in tool to generate a shareable QR code for the website.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) (TypeScript)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Special Effects:** [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Utilities:** [QRCode.react](https://github.com/zpao/qrcode.react)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd happybirthday
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components/`: Modular React components (Chat, Quiz, Scenes, etc.).
- `src/data.ts`: Centralized data store for messages, scenes, and secrets.
- `public/`: Static assets including images of Keiza and the background music.
- `src/App.tsx`: Main application logic and routing.

## 📝 Configuration

You can customize the content in `src/data.ts`:
- Change the `SECRET_PIN`.
- Update the `scenes` with your own photos and stories.
- Modify the `finalMessage` and `chatSteps`.

---

Made with ❤️ by [Deni](https://github.com/deni)
