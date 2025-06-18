"use client";

import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import type { StudentProfile } from '@/types';
import { mockStudentProfile, STUDENT_PROFILE_KEY } from '@/lib/mock-data';
import { Save } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  fieldOfStudy: z.string().min(2, { message: "Field of study is required." }),
  academicRecordSummary: z.string().min(10, { message: "Academic summary must be at least 10 characters." }).max(1000),
  financialSituation: z.string().min(10, { message: "Financial situation summary must be at least 10 characters." }).max(1000),
  extracurricularActivities: z.string().min(5, {message: "Please list some activities or enter N/A."}).max(1000),
  goalsAndAspirations: z.string().min(10, { message: "Goals and aspirations summary must be at least 10 characters." }).max(1000),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      fieldOfStudy: '',
      academicRecordSummary: '',
      financialSituation: '',
      extracurricularActivities: '',
      goalsAndAspirations: '',
    },
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem(STUDENT_PROFILE_KEY);
    let initialProfile: StudentProfile;
    if (storedProfile) {
      initialProfile = JSON.parse(storedProfile);
    } else {
      initialProfile = mockStudentProfile; // Use mock if nothing is stored
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(initialProfile));
    }
    // Reset form with loaded or mock data
    form.reset({
      name: initialProfile.name,
      email: initialProfile.email,
      fieldOfStudy: initialProfile.fieldOfStudy,
      academicRecordSummary: initialProfile.academicRecordSummary,
      financialSituation: initialProfile.financialSituation,
      extracurricularActivities: initialProfile.extracurricularActivities,
      goalsAndAspirations: initialProfile.goalsAndAspirations,
    });
  }, [form]);

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    const updatedProfile: StudentProfile = {
      id: JSON.parse(localStorage.getItem(STUDENT_PROFILE_KEY) || '{}').id || 'student123', // Retain ID
      ...data,
    };
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updatedProfile));
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
      variant: "default",
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">My Profile</CardTitle>
              <CardDescription>Keep your information up-to-date to get the best bursary matches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Alex Johnson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E.g., alex.johnson@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Computer Science, Fine Arts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="academicRecordSummary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Record Summary</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Summarize your academic achievements, GPA, relevant coursework, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financialSituation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Situation</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Briefly describe your financial need for a bursary." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="extracurricularActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extracurricular Activities & Skills</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="List any relevant activities, volunteer work, skills, or talents." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goalsAndAspirations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goals and Aspirations</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Describe your future goals and how a bursary would help you achieve them." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
