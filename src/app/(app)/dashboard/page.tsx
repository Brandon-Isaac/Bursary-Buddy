"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle, Clock, Lightbulb, ListChecks, Loader2, Search } from 'lucide-react';
import type { Bursary, StudentProfile, Application } from '@/types';
import { mockStudentProfile, mockBursaries, STUDENT_PROFILE_KEY, APPLIED_BURSARIES_KEY, ALL_BURSARIES_KEY } from '@/lib/mock-data';
import { BursaryCard } from '@/components/BursaryCard';
import Link from 'next/link';
import { matchBursaries } from '@/ai/flows/match-bursaries';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { ApplicationStatusBadge } from '@/components/ApplicationStatusBadge';

export default function DashboardPage() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [allBursaries, setAllBursaries] = useState<Bursary[]>(mockBursaries); // Start with mockBursaries
  const [recommendedBursaries, setRecommendedBursaries] = useState<Bursary[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isMatching, startMatchingTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    // Load student profile from localStorage
    const storedProfile = localStorage.getItem(STUDENT_PROFILE_KEY);
    if (storedProfile) {
      setStudentProfile(JSON.parse(storedProfile));
    } else {
      // If no profile, use mock and save it for future use to simplify demo
      setStudentProfile(mockStudentProfile);
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(mockStudentProfile));
    }

    // Load applications from localStorage
    const storedApplications = localStorage.getItem(APPLIED_BURSARIES_KEY);
    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    }

    // Store all bursaries in localStorage if not already there, for AI to potentially use
     const storedBursaries = localStorage.getItem(ALL_BURSARIES_KEY);
     if (!storedBursaries) {
       localStorage.setItem(ALL_BURSARIES_KEY, JSON.stringify(mockBursaries));
     } else {
        setAllBursaries(JSON.parse(storedBursaries));
     }

  }, []);

  const profileCompleteness = studentProfile ? 
    (Object.values(studentProfile).filter(value => typeof value === 'string' && value.length > 0).length / Object.keys(studentProfile).length) * 100 
    : 0;

  const formatStudentProfileForAI = (profile: StudentProfile): string => {
    return `Student Name: ${profile.name}\nEmail: ${profile.email}\nField of Study: ${profile.fieldOfStudy}\nAcademic Record: ${profile.academicRecordSummary}\nFinancial Situation: ${profile.financialSituation}\nExtracurricular Activities: ${profile.extracurricularActivities}\nGoals and Aspirations: ${profile.goalsAndAspirations}`;
  };

  const formatBursaryListForAI = (bursaries: Bursary[]): string => {
    return bursaries.map(b => `Name: ${b.name}\nProvider: ${b.provider}\nDescription: ${b.description}\nEligibility: ${b.eligibilityCriteria}\nField of Study: ${b.fieldsOfStudy.join(', ')}`).join('\n\n---\n\n');
  };
  
  const handleFindMatches = async () => {
    if (!studentProfile) {
      toast({ title: "Profile Incomplete", description: "Please complete your profile to find matches.", variant: "destructive" });
      return;
    }

    startMatchingTransition(async () => {
      try {
        const profileString = formatStudentProfileForAI(studentProfile);
        const bursaryListString = formatBursaryListForAI(allBursaries);
        
        const result = await matchBursaries({ profile: profileString, bursaryList: bursaryListString });
        
        const matched = allBursaries.filter(b => result.recommendedBursaries.includes(b.name));
        setRecommendedBursaries(matched);
        toast({ title: "Matches Found!", description: `We found ${matched.length} bursaries that could be a good fit for you.`, variant: "default" });

      } catch (error) {
        console.error("Error matching bursaries:", error);
        toast({ title: "Matching Error", description: "Could not find matches at this time. Please try again later.", variant: "destructive" });
        setRecommendedBursaries([]); // Clear previous recommendations on error
      }
    });
  };
  
  const upcomingDeadlines = allBursaries
    .filter(b => new Date(b.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Welcome back, {studentProfile?.name || 'Student'}!</CardTitle>
          <CardDescription>Here's your personalized bursary dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {studentProfile ? (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Profile Completeness</h3>
                <span className="text-sm font-semibold text-primary">{Math.round(profileCompleteness)}%</span>
              </div>
              <Progress value={profileCompleteness} className="w-full mb-4 h-3" />
              {profileCompleteness < 100 && (
                <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  Your profile is not fully complete. A complete profile helps us find the best bursary matches for you. 
                  <Button variant="link" asChild className="p-0 h-auto ml-1 -translate-y-px"><Link href="/profile">Update Profile</Link></Button>
                </div>
              )}
            </div>
          ) : (
             <p>Loading profile...</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-primary" />
              <CardTitle className="text-xl font-headline">AI Recommended Bursaries</CardTitle>
            </div>
            <Button onClick={handleFindMatches} disabled={isMatching} size="sm">
              {isMatching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              {isMatching ? 'Finding Matches...' : 'Find My Matches'}
            </Button>
          </div>
          <CardDescription>Bursaries suggested by our AI based on your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {isMatching && <p className="text-center text-muted-foreground py-4">Searching for bursaries...</p>}
          {!isMatching && recommendedBursaries.length === 0 && (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recommendations yet. Click "Find My Matches" to get started.</p>
              <p className="text-xs text-muted-foreground mt-1">Make sure your profile is up-to-date for best results.</p>
            </div>
          )}
          {!isMatching && recommendedBursaries.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedBursaries.map((bursary) => (
                <BursaryCard key={bursary.id} bursary={bursary} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
             <div className="flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl font-headline">My Application Status</CardTitle>
            </div>
            <CardDescription>Track your submitted bursary applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">You haven't applied for any bursaries yet.</p>
            ) : (
              <ul className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <li key={app.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-semibold">{app.bursaryName}</p>
                      <p className="text-xs text-muted-foreground">Applied: {format(new Date(app.submittedAt), 'MMM d, yyyy')}</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </li>
                ))}
              </ul>
            )}
            {applications.length > 0 && 
            <Button variant="link" asChild className="mt-4"><Link href="/applications">View All Applications</Link></Button>}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl font-headline">Upcoming Deadlines</CardTitle>
            </div>
            <CardDescription>Don't miss these important bursary application deadlines!</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No upcoming deadlines found.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingDeadlines.map((bursary) => (
                  <li key={bursary.id} className="p-3 bg-muted/50 rounded-md">
                    <div className="flex justify-between items-center">
                      <Link href={`/bursaries/${bursary.id}`} className="font-semibold hover:underline">{bursary.name}</Link>
                      <Badge variant={new Date(bursary.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? "destructive" : "secondary"}>
                        {format(new Date(bursary.deadline), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{bursary.provider}</p>
                  </li>
                ))}
              </ul>
            )}
             {upcomingDeadlines.length > 0 && 
             <Button variant="link" asChild className="mt-4"><Link href="/bursaries">Discover More Bursaries</Link></Button>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12v5c0 3 5.07 5 8 5s8-2 8-5v-5" />
    </svg>
  )
}
