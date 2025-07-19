
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, ImageIcon, BarChart, Loader2, Database } from 'lucide-react';
import { getAdminStats } from '@/services/admin-service';

interface AdminStats {
  userCount: number;
  imageCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const adminStats = await getAdminStats();
        setStats(adminStats);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">An overview of your application.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.userCount ?? 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.imageCount ?? 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Total images generated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">Requires cloud function</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Login Analysis</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Coming Soon</div>
              <p className="text-xs text-muted-foreground">Detailed usage graphs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle>Image Generation Stats</CardTitle>
                <CardDescription>Daily count of newly generated images.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center text-muted-foreground py-12">
                    <p>Chart functionality coming soon.</p>
                </div>
            </CardContent>
          </Card>
         <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of recent user activities.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="text-center text-muted-foreground py-12">
                    <p>Activity Log Coming Soon</p>
                </div>
            </CardContent>
        </Card>
      </div>
      </>
      )}
    </div>
  );
}
