# Social Support Application

A 3-step React form for citizens to apply for financial assistance. Built with TypeScript, includes AI writing help, and supports English/Arabic with RTL.

## Quick Start

```bash
npm install
npm start
```

Open `http://localhost:3000` and you're good to go!

## What's Inside

- **3-step wizard**: Personal info → Family & financial → Situation descriptions
- **AI writing assistance**: Optional OpenAI integration for Step 3 text areas
- **Full i18n support**: English/Arabic with RTL layout
- **Smart forms**: Auto-save, validation, and data persistence
- **Location picker**: Country/state/city dropdowns with 200+ countries
- **Responsive design**: Works great on mobile and desktop

## Tech Stack

- React 19 + TypeScript
- React Hook Form for form handling
- Tailwind CSS for styling
- i18next for translations
- React Router for navigation

## Optional: AI Features

If you want the AI writing assistance, add your OpenAI API key:

```bash
# .env
REACT_APP_OPENAI_API_KEY=your_key_here
```

Without it, the app works fine - users just won't get AI suggestions.

## Project Structure

```
src/
├── components/     # UI components (Navbar, Stepper, Select, etc.)
├── pages/         # Step1, Step2, Step3, Confirm
├── context/       # Form state management
├── locales/       # English/Arabic translations
├── data/          # Location data and loaders
└── services/      # OpenAI and mock API
```

## Form Data

The app collects:
- **Step 1**: Personal details, address, contact info
- **Step 2**: Marital status, employment, income, housing
- **Step 3**: Financial situation, circumstances, reasons for applying

All data is saved to localStorage and cleared after successful submission.

## Development

```bash
npm start    # Dev server
```
