// Dashboard page route
// Demonstrates metadata + views/ import pattern
import { DashboardPage } from '@/views/dashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your learning dashboard',
};

export default DashboardPage;
