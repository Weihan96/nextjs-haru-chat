"use client"


import React from 'react';
import { Button } from '@/components/ui/button';
import CompanionCard from './CompanionCard';
import { ChevronRight } from 'lucide-react';
import Link from "next/link";
import { Companion } from '@/data/companions';

interface CategorySectionProps {
  title: string;
  companions: Companion[];
  viewAllUrl: string;
}

const CategorySection = ({
  title,
  companions,
  viewAllUrl
}: CategorySectionProps) => {
  return (
    <section className="px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <Link href={viewAllUrl}>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <span>More</span>
            <ChevronRight size={16} />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {companions.map((companion) => (
          <CompanionCard
            key={companion.id}
            id={companion.id}
            name={companion.name}
            avatar={companion.avatar}
            description={companion.description}
            tags={companion.tags}
            likes={companion.likes}
            messages={companion.messages}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
