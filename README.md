# Social Support Application (Frontend)

A 3-step React wizard to help citizens apply for financial assistance. Includes AI-assisted writing via OpenAI, English/Arabic with RTL support, accessibility basics, and local persistence.

## Prerequisites
- Node.js 18+
- An OpenAI API key

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment:
Create a `.env` file in the project root with:
```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the app:
```bash
npm start
```
Then open `http://localhost:3000`.

## Features
- Multi-step form (Personal Info → Family & Financial → Situation Descriptions)
- Progress bar and responsive Tailwind UI
- English and Arabic translations with RTL toggle
- Keyboard accessible components and ARIA roles where appropriate
- LocalStorage save/resume
- AI “Help Me Write” for Step 3 textareas using OpenAI Chat Completions (gpt-3.5-turbo)
- Mock submit API and confirmation screen

## Project Structure
- `src/i18n.js` and `src/locales/*`: i18n setup and translations
- `src/context/FormContext.js`: global form data with LocalStorage persistence
- `src/pages/Step1.js`, `Step2.js`, `Step3.js`: wizard steps
- `src/components/*`: reusable UI components (progress bar, language switcher, AI modal)
- `src/services/openai.js`: OpenAI integration with timeout and error handling
- `src/services/mockApi.js`: simulated submit

## OpenAI API
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-3.5-turbo`
- The API key is read from `REACT_APP_OPENAI_API_KEY`.

## Accessibility
- Keyboard focus management in modal
- ARIA roles/labels on progress and dialogs

## Notes
- Tailwind configured via `tailwind.config.js` and `postcss.config.js`; CSS imports in `src/index.css`.
- This is a client-only demo. Do not expose real API keys in production.
