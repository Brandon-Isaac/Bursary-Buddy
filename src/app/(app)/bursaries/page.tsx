"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BursaryCard } from '@/components/BursaryCard';
import type { Bursary } from '@/types';
import { mockBursaries, ALL_BURSARIES_KEY } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BursariesPage() {
  const [allBursaries, setAllBursaries] = useState<Bursary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('all');
  const [sortBy, setSortBy] = useState('deadline'); // 'deadline', 'amount_asc', 'amount_desc'

  useEffect(() => {
    const storedBursaries = localStorage.getItem(ALL_BURSARIES_KEY);
    if (storedBursaries) {
      setAllBursaries(JSON.parse(storedBursaries));
    } else {
      setAllBursaries(mockBursaries);
      localStorage.setItem(ALL_BURSARIES_KEY, JSON.stringify(mockBursaries));
    }
  }, []);

  const uniqueFieldsOfStudy = useMemo(() => {
    const fields = new Set<string>();
    allBursaries.forEach(bursary => {
      bursary.fieldsOfStudy.forEach(field => fields.add(field));
    });
    return Array.from(fields).sort();
  }, [allBursaries]);

  const filteredAndSortedBursaries = useMemo(() => {
    let filtered = allBursaries;

    if (searchTerm) {
      filtered = filtered.filter(bursary =>
        bursary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bursary.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bursary.provider.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedField !== 'all') {
      filtered = filtered.filter(bursary => bursary.fieldsOfStudy.includes(selectedField));
    }
    
    // Sorting
    if (sortBy === 'deadline') {
      filtered.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'amount_asc') {
      filtered.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === 'amount_desc') {
      filtered.sort((a, b) => b.amount - a.amount);
    }


    return filtered;
  }, [allBursaries, searchTerm, selectedField, sortBy]);
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedField('all');
    setSortBy('deadline');
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <GraduationCap className="w-7 h-7 text-primary" /> Discover Bursaries
              </CardTitle>
              <CardDescription>Find the perfect financial aid opportunity for your studies.</CardDescription>
            </div>
             <Button onClick={resetFilters} variant="outline" size="sm" className="md:ml-auto">
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <label htmlFor="search-bursary" className="block text-sm font-medium mb-1">Search Bursaries</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="search-bursary"
                  type="text"
                  placeholder="Keywords, name, provider..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label htmlFor="field-of-study" className="block text-sm font-medium mb-1">Filter by Field of Study</label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger id="field-of-study" className="w-full">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Fields of Study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields of Study</SelectItem>
                  {uniqueFieldsOfStudy.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div>
              <label htmlFor="sort-by" className="block text-sm font-medium mb-1">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by" className="w-full">
                   <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                  <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount_asc">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedBursaries.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedBursaries.map((bursary) => (
            <BursaryCard key={bursary.id} bursary={bursary} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-xl font-semibold mb-2">No Bursaries Found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
        </div>
      )}
    </div>
  );
}
