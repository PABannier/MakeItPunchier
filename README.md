# [Make It Punchier](https://www.makeitpunchier.com/)

Make your tweets more punchy, tweet like a pro.

[![Make It Punchier](./assets/website_preview.png)](https://www.makeitpunchier.com/)

MakeItPunchier is a web app inspired by Nutlope's [tweetbio.io](tweetbio.io) which turns your boring tweets into engaging, "punchier" tweets. Tweet like a pro.

The app is nothing more than a simple ChatGPT/Mixtral wrapper, with a tiny bit of prompt engineering. It was built as a challenge on Ascension Day 2024.

## Instructions

You can use the [live version](https://www.makeitpunchier.com/). If you prefer to run the app locally,

1. Create a `.env.local` file and fill in the following two keys

```bash
OPENAI_API_KEY=<YOUR_OPENAI_KEY>
TOGETHER_API_KEY=<YOUR_TOGETHER_AI_KEY>
```

2. Launch the app

```bash
npm run dev
```
