# Sleek Scribe AI

A document analysis and improvement application that uses AI to enhance your writing.

![Sleek Scribe AI Dashboard](https://example.com/screenshot.png)

## Overview

Sleek Scribe AI is a powerful tool that helps users analyze and improve their documents. It uses Mistral AI to provide detailed analysis and suggestions for grammar, formatting, and style improvements.

## Features

- Document upload and analysis
- AI-powered grammar, formatting, and style suggestions
- Readability assessment and document scoring
- Dashboard with analytics and document management
- User authentication and profile management
- Document deletion and management
- User profile customization
- Application settings and preferences

## Prerequisites

- Node.js 16+ and npm
- A Supabase account
- A Mistral AI API key

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd sleek-scribe-ai-edit
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MISTRAL_API_KEY=your_mistral_api_key
```

## Database Setup (REQUIRED)

You **MUST** complete this step before using the application. Without it, you will see 404 errors or "Database setup required" messages.

1. Log in to your [Supabase dashboard](https://app.supabase.io)
2. Create a new project
3. Go to the SQL Editor
4. Copy the **entire contents** of the `setup-database.sql` file from this repository
5. Paste it into the SQL Editor and run the script by clicking "Run"
6. Verify that the tables have been created by going to the "Table Editor" section

This will create the necessary tables for the application:
- `profiles`: Stores user profile information
- `documents`: Stores uploaded documents and their analysis results
- `document_suggestions`: Stores AI-generated suggestions for document improvements

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open the application in your browser at http://localhost:8080

## Usage

### Authentication

1. Sign up for a new account or sign in with an existing account
2. Complete your profile information to get started

### Managing Your Profile

1. Click on the Profile option in the sidebar
2. Update your full name, username, avatar URL, and bio
3. Save your changes to update your profile

### Customizing Application Settings

1. Navigate to the Settings page from the sidebar
2. Customize appearance preferences (light, dark, or system theme)
3. Manage notification settings and email preferences
4. Save your changes to apply the new settings

### Uploading Documents

1. Navigate to the Documents page
2. Click the Upload button and select a document
3. The document will be processed and analyzed by the AI

**Supported File Types:**
- Plain text files (.txt, .md, .html, .json) - Best results
- PDF files (.pdf) - Good results, but may take longer to process
- Word documents (.doc, .docx) - Limited support, better to convert to PDF
- Maximum file size: 25MB

### Viewing Analysis Results

1. After a document is analyzed, click on it to view the analysis
2. The Errors Solution page will show:
   - Document summary with score and readability assessment
   - Grammar issues with line-specific suggestions for improvement
   - Formatting issues with line-specific suggestions for improvement
   - Style issues with line-specific suggestions for improvement
   - Document content with highlighted problem areas
3. The analysis includes:
   - Exact line references for each issue
   - Original text segments that need improvement
   - Specific suggestions for fixing each issue
   - Detailed explanations of why changes are recommended

## Troubleshooting

### Database Issues

If you see error messages related to missing database tables or 404 errors:

1. Check that you've run the SQL setup script in the Supabase dashboard
2. Verify that your Supabase URL and key are correct in the `.env` file
3. Make sure the Row Level Security (RLS) policies are properly configured
4. Open your browser's developer console (F12) to see specific error messages

### File Upload Issues

If you encounter issues when uploading files:

1. Make sure you're uploading plain text files (.txt, .md, .html) rather than binary files
2. Check that the file size is under 5MB
3. If you see Unicode errors, the file may contain binary data that can't be processed as text

### API Issues

If you encounter issues with the Mistral API:

1. Verify that your API key is valid and properly set in the `.env` file
2. Check the console for specific error messages
3. Ensure your requests aren't exceeding the API rate limits

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Supabase for database and authentication
- **AI**: Mistral AI for document analysis and suggestions
- **Build Tools**: Vite, npm

## License

[MIT License](LICENSE)

## Acknowledgements

- [Mistral AI](https://mistral.ai) for the AI capabilities
- [Supabase](https://supabase.io) for the backend infrastructure
- [Shadcn UI](https://ui.shadcn.com) for the UI components

## Advanced Configuration

### Customizing Document Analysis

The application uses Mistral AI to analyze documents. You can customize the analysis by modifying the prompt in `src/integrations/mistral/client.ts`:

1. Open the `client.ts` file
2. Locate the `analyzeDocument` function
3. Modify the prompt template to focus on specific types of issues
4. You can emphasize grammar, style, or formatting based on your needs
5. Adjust the temperature parameter to control creativity vs. precision
   - Lower values (0.1-0.3) for more consistent, precise analysis
   - Higher values (0.5-0.7) for more varied, creative suggestions

Example of customizing the prompt for academic writing:
```javascript
const prompt = `
  You are a professional academic editor. Analyze the following document text with great attention to detail.
  
  Focus primarily on:
  - Formal academic tone and style
  - Proper citation formatting
  - Logical structure and arguments
  - Technical terminology accuracy
  
  // ... rest of prompt ...
`;
```

## Recent Updates

### Latest Changes (as of June 2024)

- Enhanced document analysis capabilities
- Improved user interface and responsiveness
- Updated dependencies to latest versions
- Fixed issues with document processing and rendering
- Added support for PDF document analysis
- Optimized Mistral API integration
- Refined error handling and user feedback
