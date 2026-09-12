# 🌲 ForestFlow — Mindful Productivity & Focus Web App

A nature-themed, mindful task scheduling and focus management web application. Designed to encourage calm, consistent daily productivity through incremental task progress, an interactive calendar strip, a customizable Pomodoro clock, and a virtual growing forest driven by focus streaks.

---

## ✨ Features

- 🌿 **Home Sanctuary:** Daily dynamic affirmations, today's focus progress ring, and active daily tasks.
- 📈 **Incremental Task Progress:** Multi-day progress tracking (`+25%` / `-25%`) built for real-world projects that take more than one day to finish.
- 📅 **Interactive Calendar Strip:** 7-day horizontal date selector and direct date-picker to schedule tasks for today, tomorrow, or future dates.
- ⏱️ **Focus Clock (Pomodoro):** 25-minute focus sprints and 5-minute restorative breaks with built-in Web Audio completion chimes.
- 🌱 **Virtual Forest & Streak Tracker:** Complete focus sessions to grow cedar and pine trees, tracking your consistency over time.
- 📱 **Multi-Device Responsive:** Designed to feel like a native mobile app on phones while staying neatly centered on desktop monitors.
- 💾 **Local Persistence:** Automatic browser persistence for tasks, streak counters, and account profiles.
- 🐳 **Docker Containerized:** Ready for containerized deployment with multi-stage Docker builds.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React 19, App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Audio:** Web Audio API (zero external asset dependencies)
- **DevOps:** Docker (Multi-stage build)

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/Naganjali-byteE/forest-flow.git
   cd forest-flow
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Running with Docker

You can build and run the application inside an isolated Docker container:

1. **Build the Docker image:**
   \`\`\`bash
   docker build -t forest-flow .
   \`\`\`

2. **Run the container:**
   \`\`\`bash
   docker run -p 3000:3000 --name forest-container forest-flow
   \`\`\`

3. Visit [http://localhost:3000](http://localhost:3000).

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).