"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CalendarDays, DollarSign, Target, FileText, CheckCircle, ExternalLink, Info } from 'lucide-react';
import type { Bursary, Application } from '@/types';
import { mockBursaries, APPLIED_BURSARIES_KEY, ALL_BURSARIES_KEY } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import Link from 'next/link';

export default function BursaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [bursary, setBursary] = useState<Bursary | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const bursaryId = params.id as string;

  useEffect(() => {
    if (bursaryId) {
      const storedBursaries = localStorage.getItem(ALL_BURSARIES_KEY);
      const bursariesList = storedBursaries ? JSON.parse(storedBursaries) : mockBursaries;
      const foundBursary = bursariesList.find((b: Bursary) => b.id === bursaryId);
      setBursary(foundBursary || null);

      const storedApplications = localStorage.getItem(APPLIED_BURSARIES_KEY);
      if (storedApplications) {
        const applications: Application[] = JSON.parse(storedApplications);
        setIsApplied(applications.some(app => app.bursaryId === bursaryId));
      }
      setIsLoading(false);
    }
  }, [bursaryId]);

  const handleApply = () => {
    if (!bursary) return;

    const newApplication: Application = {
      id: `app-${Date.now()}`, // Simple unique ID
      studentId: 'student123', // Mock student ID
      bursaryId: bursary.id,
      bursaryName: bursary.name,
      status: 'Applied', 
      submittedAt: new Date().toISOString(),
    };

    const storedApplications = localStorage.getItem(APPLIED_BURSARIES_KEY);
    const applications: Application[] = storedApplications ? JSON.parse(storedApplications) : [];
    applications.push(newApplication);
    localStorage.setItem(APPLIED_BURSARIES_KEY, JSON.stringify(applications));
    
    setIsApplied(true);
    toast({
      title: "Application Submitted!",
      description: `You have successfully applied for ${bursary.name}.`,
      variant: "default",
    });
    // Optionally redirect or update UI further
    // router.push('/applications');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><p>Loading bursary details...</p></div>;
  }

  if (!bursary) {
    return (
       <div className="flex flex-col items-center justify-center h-screen text-center">
        <GraduationCap className="w-24 h-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-2">Bursary Not Found</h1>
        <p className="text-muted-foreground mb-6">The bursary you are looking for does not exist or may have been removed.</p>
        <Button asChild>
          <Link href="/bursaries">Back to Bursary List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-64 md:h-80 w-full">
            <Image
            src={bursary.imageUrl || "https://placehold.co/1200x400.png"}
            alt={bursary.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="education funding"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-white leading-tight">{bursary.name}</h1>
                <p className="text-lg text-gray-200">{bursary.provider}</p>
            </div>
        </div>
        
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2"><Info className="w-5 h-5"/>Description</h2>
              <p className="text-muted-foreground leading-relaxed">{bursary.description}</p>
            </div>
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <InfoItem icon={<DollarSign />} label="Amount" value={`$${bursary.amount.toLocaleString()}`} />
              <InfoItem icon={<CalendarDays />} label="Deadline" value={format(new Date(bursary.deadline), 'MMMM d, yyyy')} />
              <InfoItem icon={<Target />} label="Fields of Study">
                <div className="flex flex-wrap gap-2 mt-1">
                  {bursary.fieldsOfStudy.map(field => (
                    <Badge key={field} variant="secondary">{field}</Badge>
                  ))}
                </div>
              </InfoItem>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2 text-primary flex items-center gap-2"><FileText className="w-5 h-5"/>Eligibility Criteria</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{bursary.eligibilityCriteria}</p>
          </div>

          {isApplied ? (
            <Alert variant="default" className="bg-primary/10 border-primary/30">
              <CheckCircle className="h-5 w-5 text-primary" />
              <AlertTitle className="font-semibold text-primary">Application Submitted</AlertTitle>
              <AlertDescription>
                You have already applied for this bursary. You can check its status in <Link href="/applications" className="font-medium underline hover:text-primary/80">My Applications</Link>.
              </AlertDescription>
            </Alert>
          ) : new Date(bursary.deadline) < new Date() ? (
             <Alert variant="destructive">
              <CalendarDays className="h-5 w-5" />
              <AlertTitle className="font-semibold">Deadline Passed</AlertTitle>
              <AlertDescription>
                The application deadline for this bursary has passed.
              </AlertDescription>
            </Alert>
          ) : null}

        </CardContent>
        <CardFooter className="bg-background/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/bursaries">Back to List</Link>
          </Button>
          <div className="flex gap-4">
            {bursary.applicationLink && bursary.applicationLink !== '#' && (
              <Button variant="secondary" asChild>
                <a href={bursary.applicationLink} target="_blank" rel="noopener noreferrer">
                  Official Site <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button 
              onClick={handleApply} 
              disabled={isApplied || new Date(bursary.deadline) < new Date()}
              size="lg"
            >
              {isApplied ? 'Applied' : new Date(bursary.deadline) < new Date() ? 'Deadline Passed' : 'Apply Now'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  children?: React.ReactNode;
}

function InfoItem({ icon, label, value, children }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-accent mt-1">{icon}</span>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {value && <p className="text-sm text-muted-foreground font-semibold">{value}</p>}
        {children}
      </div>
    </div>
  );
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) { // Added for fallback UI
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
