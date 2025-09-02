# Mini SaaS Dashboard - Project Management

A modern, responsive project management dashboard built with Next.js and Tailwind CSS.

## Features

### 🎯 Core Functionality
- **Project Management**: Create, read, update, and delete projects
- **Advanced Filtering**: Search projects by name/description and filter by status or team member
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark/light mode based on system preference

### 📊 Project Data
Each project includes:
- Project name and description
- Status (Active, On Hold, Completed)
- Assigned team member
- Deadline
- Budget
- Creation and update timestamps

### 🎨 UI/UX Features
- Clean, modern interface with Tailwind CSS
- Real-time search and filtering
- Modal-based forms for adding/editing projects
- Responsive table view (desktop) and card view (mobile)
- Loading states and form validation
- Confirmation dialogs for destructive actions
- Smart budget input field with automatic number formatting (no default 0)

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Heroicons (SVG)
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd QNA-task
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Main dashboard page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── Modal.tsx       # Modal wrapper component
│   └── ProjectForm.tsx # Project form with validation
├── data/              # Static data
│   └── projects.ts    # Dummy project data
└── types/             # TypeScript type definitions
    └── project.ts     # Project-related types
```

## Features in Detail

### Search & Filtering
- **Text Search**: Search across project names and descriptions
- **Status Filter**: Filter by Active, On Hold, or Completed projects
- **Team Member Filter**: Filter by assigned team member
- **Clear Filters**: One-click filter reset
- **Results Counter**: Shows filtered vs total project count

### Responsive Design
- **Mobile First**: Card-based layout for mobile devices
- **Desktop Table**: Full-featured table for larger screens
- **Adaptive Components**: All components scale appropriately
- **Touch Friendly**: Optimized for touch interactions

### Form Validation
- **Real-time Validation**: Immediate feedback on form errors
- **Required Fields**: Name, team member, deadline, and budget
- **Date Validation**: Prevents past deadline dates
- **Budget Validation**: Ensures positive budget values
- **Loading States**: Visual feedback during form submission

### Data Management
- **Local State**: Projects stored in React state (simulates API)
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Auto-generated IDs**: Automatic ID assignment for new projects
- **Timestamps**: Automatic creation and update timestamps

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run troubleshoot` - Run diagnostic script for common issues

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Responsive design best practices
- Accessible UI components

## Support & Troubleshooting

### Quick Diagnostics
```bash
npm run troubleshoot
```

### Documentation
- **[Support Playbook](SUPPORT_PLAYBOOK.md)** - Complete troubleshooting guide for common issues
- **[Test Documentation](TEST_DOCUMENTATION.md)** - Comprehensive testing information and examples

### Common Issues
- **No projects showing**: Check browser console, verify data loading
- **Form not saving**: Validate required fields and date/budget constraints
- **Mobile layout issues**: Clear cache, try different browser

## Future Enhancements

- Backend API integration
- User authentication
- Project categories/tags
- File attachments
- Team collaboration features
- Advanced reporting and analytics
- Export functionality
- Drag-and-drop project organization

## License

This project is created for demonstration purposes.