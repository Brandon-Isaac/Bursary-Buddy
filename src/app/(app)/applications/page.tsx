"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApplicationStatusBadge } from '@/components/ApplicationStatusBadge';
import type { Application } from '@/types';
import { APPLIED_BURSARIES_KEY } from '@/lib/mock-data';
import { FileText, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedApplications = localStorage.getItem(APPLIED_BURSARIES_KEY);
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications).sort((a:Application, b:Application) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Loading applications...</p></div>;
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
              <FileText className="w-7 h-7 text-primary" />
              <CardTitle className="text-2xl font-headline">My Applications</CardTitle>
          </div>
          <CardDescription>Track the status of all your bursary applications.</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
              <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
              <p className="text-muted-foreground mb-4">You haven't applied for any bursaries. Start exploring to find opportunities!</p>
              <Button asChild>
                <Link href="/bursaries">Discover Bursaries</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Bursary Name</TableHead>
                    <TableHead>Submitted On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        <Link href={`/bursaries/${app.bursaryId}`} className="hover:underline text-primary">
                            {app.bursaryName}
                        </Link>
                      </TableCell>
                      <TableCell>{format(new Date(app.submittedAt), 'MMMM d, yyyy')}</TableCell>
                      <TableCell>
                        <ApplicationStatusBadge status={app.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/bursaries/${app.bursaryId}`}>View Bursary</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
