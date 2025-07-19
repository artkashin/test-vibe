# Test Vibe Activities - Obsidian Plugin

An Obsidian plugin that provides a sidebar panel listing all activities from markdown files in your vault.

## Features

- **Activities Sidebar Panel**: Displays all markdown files in your vault as a list of activities
- **Configurable Display**: Options to show/hide file extensions
- **Multiple Sort Orders**: Sort activities alphabetically, by last modified date, or by creation date
- **Quick Navigation**: Click any activity to open it in the editor
- **Ribbon Icon**: Easy access to the activities panel via the ribbon bar

## Installation

1. Copy the plugin files to your `.obsidian/plugins/test-vibe-activities/` folder in your vault
2. Enable the plugin in Obsidian's Community Plugins settings
3. The activities panel will appear in the sidebar

## Usage

### Opening the Activities Panel

You can open the activities panel in several ways:
- Click the list icon in the ribbon bar
- Use the command palette: "Open Activities Panel"
- The panel will appear in the right sidebar

### Settings

Access plugin settings through Settings → Community Plugins → Test Vibe Activities:

- **Show file extension**: Toggle whether to display `.md` extensions in activity names
- **Sort order**: Choose how activities are sorted:
  - Alphabetical: Sort by filename
  - Last modified: Most recently modified files first  
  - Date created: Most recently created files first

### Sample Activities

This repository includes sample activity files to demonstrate the plugin:
- Weekly Team Meeting.md
- Code Review Session.md
- Project Planning Workshop.md

## Development

### Building the Plugin

```bash
npm install
npm run build
```

### Development Mode

```bash
npm run dev
```

This will start the build process in watch mode for active development.

## About Copilot

Hi! I'm GitHub Copilot, an AI-powered coding assistant developed by GitHub and OpenAI. I'm here to help you with your coding tasks, answer questions, and assist with various development activities. I can:

- Help write and review code in multiple programming languages
- Suggest improvements and optimizations
- Assist with debugging and troubleshooting
- Explain complex code concepts
- Help with documentation and README files (like this one!)
- Support various development workflows and best practices

I'm designed to work alongside developers to make coding more efficient and enjoyable. Feel free to ask me anything related to your project!
