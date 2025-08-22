# 🚀 Flowbee.ai : AI Co-Creator for Social Media
*Agentic Automation of content creation & posting for Instagram, LinkedIn, Twitter (X), Reddit, and more.*

---

## 📖 Overview
AI Co-Creator is an **end-to-end automation agent** that helps creators, marketers, and businesses scale their social media presence.  
Simply **enter the title of a post**, and the system will:
- Generate engaging **post content with hashtags**.
- Create or fetch **relevant images**.
- Automatically **publish** to selected platforms (LinkedIn, Instagram, Twitter/X, Reddit, etc.).

Built with AI workflows and automation, it reduces manual effort and ensures **consistent, platform-optimized posting**.

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/) – React framework for fast, SEO-friendly UI  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Shadcn/ui](https://ui.shadcn.com/) – Component library for modern UI  

**Backend**
- [Python](https://www.python.org/) – Core backend logic  
- [LangChain](https://www.langchain.com/) – AI orchestration  
- [LangGraph](https://www.langchain.com/langgraph) – Agentic workflows  
- [n8n](https://n8n.io/) – Workflow automation  
- [CrewAI](https://www.crewai.com/) – AI agent collaboration  

**APIs & Integrations**
- [OpenAI](https://platform.openai.com/) – Content & image generation  
- [Google](https://cloud.google.com/) – Sheets, Drive & Gmail integrations  
- [Meta API](https://developers.facebook.com/docs/instagram-api) – Instagram automation  
- [LinkedIn API](https://learn.microsoft.com/en-us/linkedin/) – LinkedIn publishing  
- [Twitter/X API](https://developer.twitter.com/en/docs) – Tweet automation  
- [Reddit API](https://www.reddit.com/dev/api/) – Reddit posting  

---

## ⚡ Features
✅ Automatically **trigger workflows** based on schedule or user input  
✅ Generate **platform-specific posts** (LinkedIn, Instagram, Twitter, Reddit)  
✅ Create **relevant images** for posts  
✅ Direct **upload to platforms** without manual intervention  
✅ AI-powered **content writing with hashtags**  
✅ Approval workflows with **regeneration options**  
✅ **Google Sheets integration** for tracking  

---
## 🔄 Technical Workflow

- User Input: Enter post title (via frontend UI or Google Sheets).

- AI Content Generation:

- LangChain + OpenAI generates post content with hashtags.

- Formats content per platform requirements.

- Approval Workflow:

- Sends draft via Gmail for confirmation.

- Option to regenerate post if needed.

- Image Handling:

- Generate new image (OpenAI/Stable Diffusion) OR fetch existing one.

- Publishing:

- Directly upload to LinkedIn, Instagram, Twitter, Reddit.

- Tracking:

- Update Google Sheet with status & post link.

---
## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-co-creator.git
cd ai-co-creator
```
### 2. Install dependencies
#### Frontend
```bash
cd frontend
npm install
npm run dev
```
#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```
### 3. Configure environment variables
#### Create a .env file in both frontend and backend directories:
```bash
OPENAI_API_KEY=your_key
GOOGLE_API_KEY=your_key
LINKEDIN_ACCESS_TOKEN=your_token
TWITTER_BEARER_TOKEN=your_token
REDDIT_CLIENT_ID=your_id
REDDIT_SECRET=your_secret
```
### 4. Run n8n workflows
```bash
n8n start
```
