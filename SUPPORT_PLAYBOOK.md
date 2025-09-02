# Support Playbook - Mini SaaS Dashboard
*Version 1.0 | Last Updated: January 2025*

## 🚀 Local Setup Guide

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd QNA-task
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open browser and navigate to: `http://localhost:3000`
   - The dashboard should load with sample project data

### Verification Checklist
- ✅ Dashboard loads without errors
- ✅ Sample projects are visible (8 projects by default)
- ✅ Search and filter functionality works
- ✅ "Add Project" button opens modal form
- ✅ Responsive design works on mobile/desktop

---

## 🔧 Common Issues & Troubleshooting

### Issue #1: "I don't see any projects"

**Symptoms:**
- Dashboard loads but shows empty table/cards
- "No projects found" message appears
- Stats cards show "0" for all counts

**Troubleshooting Steps:**
1. **Check Browser Console**
   - Press F12 → Console tab
   - Look for JavaScript errors (red text)
   - Common errors: Module import failures, data loading issues

2. **Verify Data Loading**
   - Check if `src/data/projects.ts` exists
   - Ensure dummy data is properly imported
   - Restart development server: `Ctrl+C` then `npm run dev`

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear browser cache and cookies for localhost:3000

4. **Check Network Tab**
   - F12 → Network tab → Reload page
   - Verify all resources load successfully (no 404 errors)

**Resolution:**
- If data file is missing: Restore from version control
- If imports are broken: Check file paths in `src/app/page.tsx`
- If still failing: Reinstall dependencies with `npm install`

### Issue #2: "The form doesn't save"

**Symptoms:**
- Modal form opens but clicking "Create/Update Project" does nothing
- Loading spinner appears indefinitely
- Form data is lost when modal closes

**Troubleshooting Steps:**
1. **Check Form Validation**
   - Ensure all required fields are filled:
     - Project Name (required)
     - Team Member (required)
     - Deadline (required, must be future date)
     - Budget (required, must be > 0)

2. **Verify JavaScript Execution**
   - Open Browser Console (F12)
   - Look for validation errors or JavaScript exceptions
   - Check if form submission handler is called

3. **Test Form Fields Individually**
   - Try filling one field at a time
   - Check if specific fields trigger validation errors
   - Verify date format (YYYY-MM-DD)
   - For budget: Enter numbers only (e.g., 50000 or 50000.50)

4. **Check Network Requests**
   - F12 → Network tab
   - Submit form and check for failed requests
   - Note: This is a frontend-only app, no actual API calls

**Resolution:**
- **Validation Errors**: Fix field values according to requirements
- **Date Issues**: Use future dates only (not past dates)
- **Budget Issues**: Enter positive numbers only (field accepts text input with automatic formatting)
- **Browser Issues**: Try different browser or incognito mode

### Issue #3: "The page looks broken on mobile"

**Symptoms:**
- Layout appears cramped or overlapping on mobile
- Buttons are too small to tap
- Text is unreadable
- Horizontal scrolling required

**Troubleshooting Steps:**
1. **Check Viewport Settings**
   - Verify responsive design is enabled
   - Test on actual mobile device vs browser dev tools

2. **Browser Compatibility**
   - Test on different mobile browsers
   - Ensure JavaScript is enabled
   - Check if ad blockers interfere

3. **Clear Mobile Browser Cache**
   - Clear cache and cookies
   - Force refresh the page

**Resolution:**
- The app uses responsive design (mobile-first)
- Mobile shows card layout, desktop shows table layout
- If issues persist, try different mobile browser

### Issue #4: "Search/Filter not working"

**Symptoms:**
- Typing in search box shows no results
- Filter dropdowns don't affect displayed projects
- "Clear filters" button doesn't appear

**Troubleshooting Steps:**
1. **Test Search Functionality**
   - Try searching for known project names (e.g., "Mobile", "E-commerce")
   - Check if search is case-sensitive (it shouldn't be)

2. **Test Filter Dropdowns**
   - Try filtering by "Active" status
   - Try filtering by specific team member
   - Combine multiple filters

3. **Check Browser State**
   - Refresh page to reset filters
   - Check console for JavaScript errors

**Resolution:**
- Search works on project names and descriptions
- Filters work independently and can be combined
- Use "Clear all filters" to reset all filters at once

---

## ❓ Frequently Asked Questions (FAQ)

### Q1: How do I add my own project data instead of the sample data?

**A:** The sample data is located in `src/data/projects.ts`. To add your own projects:

1. Open `src/data/projects.ts`
2. Replace the `dummyProjects` array with your own data
3. Follow the same structure:
   ```typescript
   {
     id: 'unique-id',
     name: 'Project Name',
     status: 'active' | 'on hold' | 'completed',
     deadline: '2024-12-31',
     assignedTeamMember: 'Team Member Name',
     budget: 50000,
     description: 'Optional description',
     createdAt: '2024-01-01T00:00:00Z',
     updatedAt: '2024-01-01T00:00:00Z'
   }
   ```
4. Save the file and the dashboard will update automatically

### Q2: Can I customize the project statuses or add new ones?

**A:** Yes, but it requires code changes:

1. **Update Type Definition**: Edit `src/types/project.ts`
   ```typescript
   export type ProjectStatus = 'active' | 'on hold' | 'completed' | 'your-new-status';
   ```

2. **Update Form Options**: Edit `src/components/ProjectForm.tsx`
   - Add new `<option>` in the status dropdown

3. **Update Filter Options**: Edit `src/app/page.tsx`
   - Add new option in the status filter dropdown

4. **Update Status Colors**: Edit the status badge styling in `src/app/page.tsx`
   - Add color scheme for your new status

### Q3: How do I deploy this application to production?

**A:** The application is built with Next.js and can be deployed to various platforms:

**Option 1: Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Deploy automatically with zero configuration

**Option 2: Netlify**
1. Build the application: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure build settings if needed

**Option 3: Traditional Hosting**
1. Run: `npm run build` to create production build
2. Run: `npm start` to start production server
3. Configure reverse proxy (nginx) if needed

**Environment Variables:**
- No environment variables required for basic functionality
- All data is stored locally in the browser

### Q4: Why don't my changes persist when I refresh the page?

**A:** This is expected behavior. The dashboard is designed as a demo application with local state management:

- **Data Storage**: All project data is stored in React state (memory only)
- **No Backend**: There's no database or API backend
- **Session-based**: Data resets when page is refreshed

**To Add Persistence:**
- Implement localStorage for client-side persistence
- Add a backend API with database integration
- Use a state management library like Redux with persistence

### Q5: How do I run the test suite?

**A:** The application includes a comprehensive test suite:

**Run Tests:**
```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**Test Coverage:**
- 54 total test cases
- Covers search, filtering, CRUD operations, validation, and responsive design
- Uses Jest and React Testing Library

**Test Files:**
- `src/__tests__/Dashboard.test.tsx` - Main dashboard tests
- `src/__tests__/components/` - Component unit tests
- `TEST_DOCUMENTATION.md` - Detailed test documentation

### Q6: Why doesn't the budget field start with 0 anymore?

**A:** We improved the user experience for the budget field:

**Previous Behavior:**
- Budget field was a number input that defaulted to 0
- Users had to manually select and delete the 0 to enter a new value
- Poor user experience for data entry

**New Behavior:**
- Budget field is now a text input that starts empty
- Automatically formats input to allow only numbers and decimals
- Limits decimal places to 2 (e.g., 123.45)
- Filters out invalid characters automatically
- Much more user-friendly for entering budget amounts

**Usage:**
- Simply click in the field and start typing numbers
- Supports whole numbers (50000) and decimals (50000.50)
- Invalid characters are automatically removed
- No need to clear a default 0 value

### Q7: What browsers are supported?

**A:** The dashboard supports all modern browsers:

**Fully Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Browsers:**
- Chrome Mobile
- Safari Mobile
- Samsung Internet
- Firefox Mobile

**Not Supported:**
- Internet Explorer (any version)
- Very old browser versions (pre-2020)

**Features Used:**
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Modern DOM APIs
- Responsive design with CSS media queries

---

## 📞 Support Escalation

### When to Escalate
- User reports data corruption or loss
- Application completely fails to load
- Security-related concerns
- Performance issues affecting multiple users

### Information to Collect
- Browser type and version
- Device type (desktop/mobile/tablet)
- Steps to reproduce the issue
- Screenshots or screen recordings
- Browser console errors
- Network connectivity status

### Contact Information
- **Level 1 Support**: Check this playbook first
- **Level 2 Support**: Developer team for code-related issues
- **Level 3 Support**: System administrators for infrastructure issues

---

*This playbook covers the most common support scenarios. For issues not covered here, please escalate to the development team with detailed reproduction steps and error messages.*
