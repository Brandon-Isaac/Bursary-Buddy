import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Target, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { Logo } from '@/components/Logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-primary/10">
      <header className="container mx-auto py-6 px-4 md:px-6 flex justify-between items-center">
        <Logo size="md" />
        <Button asChild variant="outline">
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </header>

      <main className="flex-1">
        <section className="container mx-auto py-12 md:py-24 px-4 md:px-6 text-center">
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Unlock Your Future with <span className="text-primary">Bursary Buddy</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Our AI-powered platform connects you with the financial aid you need, making your educational dreams a reality. Say goodbye to endless searching and hello to smart matches.
          </p>
          <Button asChild size="lg" className="font-semibold">
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-16 relative">
            <Image
              src="https://placehold.co/1200x600.png"
              alt="Bursary Buddy Dashboard Preview"
              width={1200}
              height={600}
              className="rounded-xl shadow-2xl mx-auto"
              data-ai-hint="dashboard interface"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent rounded-xl"></div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background/50">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Bursary Buddy?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Target className="w-10 h-10 text-primary" />}
                title="Smart Matching"
                description="Our AI algorithm intelligently matches your profile with the most suitable bursaries, saving you time and effort."
              />
              <FeatureCard
                icon={<CheckCircle className="w-10 h-10 text-primary" />}
                title="Centralized Applications"
                description="Apply to multiple bursaries through a single, streamlined platform. Track your applications with ease."
              />
              <FeatureCard
                icon={<GraduationCap className="w-10 h-10 text-primary" />}
                title="Personalized Dashboard"
                description="Get a clear overview of recommended bursaries, application statuses, and important deadlines, all in one place."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-muted-foreground border-t">
        <div className="container mx-auto px-4 md:px-6">
          &copy; {new Date().getFullYear()} Bursary Buddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg text-center transition-all hover:shadow-xl hover:scale-105">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-headline text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
