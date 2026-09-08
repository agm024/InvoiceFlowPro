const fs = require('fs');

let sidebar = fs.readFileSync('components/Sidebar.tsx', 'utf8');

const targetNavGroups = `  const navGroups = [
    {
      label: 'Insights',
      items: [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'Reports', href: '/app/reports', icon: PieChart },
      ]
    },
    {
      label: 'Money',
      items: [
        { name: 'Invoices & Payments', href: '/app/invoices', icon: Receipt },
        { name: 'Estimates', href: '/app/estimates', icon: FileText },
        { name: 'Expenses', href: '/app/expenses', icon: CreditCard },
        { name: 'Transfers', href: '/app/transfers', icon: ArrowRightLeft },
      ]
    },
    {
      label: 'Work',
      items: [
        { name: 'Clients', href: '/app/clients', icon: Users },
        { name: 'Projects', href: '/app/projects', icon: FolderKanban },
        { name: 'Products', href: '/app/products', icon: Box },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'Billing & Plans', href: '/app/billing', icon: CreditCard },
        { name: 'Export Data', href: '/app/export', icon: Download },
        { name: 'Settings', href: '/app/settings', icon: Settings },
        { name: 'Help & Support', href: '/app/support', icon: MessageSquare },
      ]
    }
  ]`;

const newNavGroups = `  const navGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
        { name: 'Reports', href: '/app/reports', icon: PieChart },
      ]
    },
    {
      label: 'Sales',
      items: [
        { name: 'Invoices', href: '/app/invoices', icon: Receipt },
        { name: 'Estimates', href: '/app/estimates', icon: FileText },
        { name: 'Clients', href: '/app/clients', icon: Users },
        { name: 'Products', href: '/app/products', icon: Box },
      ]
    },
    {
      label: 'Expenses',
      items: [
        { name: 'Expenses', href: '/app/expenses', icon: CreditCard },
        { name: 'Payments/Transfers', href: '/app/transfers', icon: ArrowRightLeft },
      ]
    },
    {
      label: 'Work',
      items: [
        { name: 'Projects', href: '/app/projects', icon: FolderKanban },
      ]
    },
    {
      label: 'Business',
      items: [
        { name: 'Settings', href: '/app/settings', icon: Settings },
        { name: 'Billing & Plans', href: '/app/billing', icon: CreditCard },
        { name: 'Export Data', href: '/app/export', icon: Download },
        { name: 'Help & Support', href: '/app/support', icon: MessageSquare },
      ]
    }
  ]`;

sidebar = sidebar.replace(targetNavGroups, newNavGroups);

fs.writeFileSync('components/Sidebar.tsx', sidebar, 'utf8');

