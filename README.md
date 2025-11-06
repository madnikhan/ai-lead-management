# Lead Management Dashboard

A comprehensive lead management dashboard built with Next.js 14, featuring unified lead inbox, scoring, analytics, team assignment, and ROI tracking.

## Features

### 🎯 Core Features

- **Unified Lead Inbox**: Centralized view of all leads from chatbot and phone system
  - Filter by source (chatbot/phone)
  - Filter by status
  - Sort by score, date, or value
  - Lead scoring and prioritization

- **Performance Analytics**: Comprehensive analytics dashboard
  - Monthly lead & revenue trends
  - Leads by source visualization
  - Leads by status breakdown
  - Conversion funnel analysis

- **Team Assignment & Tracking**: Manage team performance
  - Individual team member dashboards
  - Lead assignment tracking
  - Conversion rate monitoring
  - Pipeline value tracking

- **ROI Calculator**: Detailed ROI analysis
  - ROI percentage calculation
  - LTV:CAC ratio tracking
  - Cost per lead analysis
  - Revenue per lead metrics
  - Payback period estimation
  - 12-month ROI projection

### 🎨 Design System

- Modern, clean UI with Tailwind CSS
- Responsive design for all screen sizes
- Professional color scheme with gradients
- Interactive charts powered by Recharts
- Intuitive navigation with tab-based layout

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Responsive chart library
- **Lucide React**: Modern icon library
- **date-fns**: Date formatting utilities

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the general dashboard.

Open [http://localhost:3000/dashboard-demo](http://localhost:3000/dashboard-demo) to view the **Roofing Company AI Lead Management Dashboard**.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Main page (general dashboard)
│   ├── dashboard-demo/
│   │   └── page.tsx                  # Roofing dashboard demo page
│   └── globals.css                   # Global styles
├── components/
│   ├── Dashboard.tsx                  # General dashboard component
│   ├── RoofingDashboard.tsx          # Roofing-specific dashboard
│   ├── HeaderMetrics.tsx             # Header metrics (roofing)
│   ├── LeadInbox.tsx                 # Lead inbox (roofing-focused)
│   ├── LeadScoring.tsx               # AI lead scoring system
│   ├── AnalyticsOverview.tsx         # Analytics overview (roofing)
│   ├── PerformanceMetrics.tsx      # Performance metrics (roofing)
│   ├── ROICalculator.tsx             # ROI calculator (roofing)
│   ├── TeamManagement.tsx            # Team management (roofing)
│   ├── PerformanceAnalytics.tsx      # Analytics charts (general)
│   ├── TeamAssignment.tsx            # Team management (general)
│   └── ROICalculator.tsx             # ROI calculations (general)
├── lib/
│   ├── mockData.ts                   # General mock data
│   └── mock-data.ts                  # Roofing-specific mock data
├── types/
│   ├── index.ts                       # General type definitions
│   └── roofing.ts                    # Roofing-specific types
└── package.json
```

## Mock Data

The dashboard uses realistic mock data showing impressive results:
- 1,247 total leads
- 68.5% conversion rate
- $2.84M total revenue
- 424:1 LTV:CAC ratio
- 2,172% ROI

## Features in Detail

### Lead Scoring & Prioritization

- Automatic lead scoring (60-100 scale)
- Priority levels: High, Medium, Low
- Visual indicators for quick assessment
- Sortable by score, date, or value

### Analytics Dashboard

- Real-time performance metrics
- Interactive charts and graphs
- Monthly trend analysis
- Conversion funnel visualization
- Source attribution tracking

### Team Management

- Individual performance tracking
- Lead assignment overview
- Status breakdown per team member
- Top leads per team member
- Conversion rate monitoring

### ROI Calculator

- Comprehensive financial metrics
- Interactive 12-month projection
- Investment vs revenue comparison
- Efficiency scoring
- Payback period analysis

## Roofing Company Dashboard Demo

The `/dashboard-demo` route features a specialized AI Lead Management Dashboard designed for roofing companies, showcasing:

### 🏠 Roofing-Specific Features

- **24/7 Lead Capture**: Displays leads captured outside business hours (7 AM - 7 PM)
- **Emergency Lead Detection**: Automatic flagging of urgent roofing emergencies (leaks, storm damage, etc.)
- **AI Lead Scoring**: Dual scoring system
  - Emergency Score (1-10): Based on urgency indicators
  - Quality Score (1-10): Based on lead completeness
- **Job-Based Revenue Tracking**: 
  - Emergency jobs @ $1,200 average
  - Standard jobs @ $800 average
  - Real-time revenue calculation
- **Response Time Metrics**: 
  - Emergency response time: <30 minutes
  - Standard response time: <60 minutes
- **After-Hours Capture**: Demonstrates value of 24/7 chatbot and phone system

### 📊 Dashboard Sections

1. **Header Metrics**: Total leads, emergency alerts, conversion rate, estimated revenue
2. **Unified Lead Inbox**: Combined chatbot and phone leads with emergency flags
3. **AI Lead Scoring**: Priority queue sorted by AI-calculated priority score
4. **Analytics Overview**: Leads by source, time, status, and response metrics
5. **Performance Metrics**: Conversion funnel, revenue by source, weekly breakdown
6. **ROI Calculator**: 
   - "Based on your 32 leads this month"
   - "5 emergency jobs @ $1,200 avg = $6,000"
   - "8 standard jobs @ $800 avg = $6,400"
   - "Total: $12,400 revenue"
   - "Your cost: $697/month"
   - ROI: 1,679%
7. **Team Management**: Lead assignment, conversion tracking, revenue per team member

### 🎯 Demo Scenarios

- **Emergency Prioritization**: Shows how emergency leads are automatically flagged and prioritized
- **24/7 Capture Value**: Demonstrates leads captured after hours that would be missed
- **Revenue Tracking**: Clear visualization of lead-to-job conversion and revenue
- **ROI Demonstration**: Clear comparison of monthly cost vs. revenue generated

## License

This project is for demonstration purposes.

