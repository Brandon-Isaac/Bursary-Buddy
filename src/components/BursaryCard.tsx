"use client";

import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, DollarSign, Target, ArrowRight } from 'lucide-react';
import type { Bursary } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface BursaryCardProps {
  bursary: Bursary;
}

export function BursaryCard({ bursary }: BursaryCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0 relative">
        <Image
          src={bursary.imageUrl || "https://placehold.co/600x400.png"}
          alt={bursary.name}
          width={600}
          height={300} // Adjust height for a better aspect ratio
          className="object-cover w-full h-48"
          data-ai-hint="education finance"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
           <CardTitle className="text-xl font-bold text-white leading-tight">{bursary.name}</CardTitle>
           <CardDescription className="text-sm text-gray-200">{bursary.provider}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{bursary.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <span>Amount: <span className="font-semibold">${bursary.amount.toLocaleString()}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-accent" />
            <span>Deadline: <span className="font-semibold">{format(new Date(bursary.deadline), 'MMMM d, yyyy')}</span></span>
          </div>
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-accent mt-1 shrink-0" />
            <div>
              <span className="font-semibold">Fields of Study:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {bursary.fieldsOfStudy.map((field) => (
                  <Badge key={field} variant="secondary" className="text-xs">{field}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full" variant="default">
          <Link href={`/bursaries/${bursary.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
