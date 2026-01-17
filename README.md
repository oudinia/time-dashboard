# Time Zone Dashboard

A B2B team dashboard for managers of distributed teams, showing team member locations, current times, and working hours overlap.

## Features

- **Team Member Management**: Add, edit, and remove team members with their timezone and working hours
- **Real-time Clocks**: See current time for each team member updated in real-time
- **Working Hours Overlap**: Visual representation of when team members' working hours overlap
- **Best Meeting Times**: Automatic calculation of optimal meeting times for the whole team
- **Dark Mode**: Toggle between light and dark themes
- **Data Persistence**: Team data is saved to localStorage automatically
- **Import/Export**: Export team data to JSON and import from files

## Tech Stack

- **Build**: Vite + SWC
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Date/Time**: Luxon
- **State**: Zustand with persist middleware

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Add Team Members**: Click "Add Member" to add team members with their name, timezone, location, and working hours.

2. **View Overlap**: The overlap summary shows when all team members are available for meetings, displayed as a 24-hour bar in UTC.

3. **Dark Mode**: Toggle the theme using the sun/moon icon in the header.

4. **Import/Export**: Use the Import/Export buttons to backup or share team configurations.

## Sample Data

A sample team configuration is available at `/sample-team.json`. You can import it to see how the dashboard works with multiple team members across different timezones.

## License

MIT
