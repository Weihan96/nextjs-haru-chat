import React from 'react';
import SearchBar from '@/components/home/SearchBar';
import CategorySection from '@/components/home/CategorySection';
import { MOCK_COMPANIONS, CATEGORIES } from '@/data/companions';
import { ScrollArea } from '@/components/ui/scroll-area';

const Home = () => {
  return (
      <ScrollArea className="h-full">
      <div className="min-h-screen pb-20">
        <SearchBar />
        <div className="animate-fade-in">
          {CATEGORIES.map((category) => (
            <CategorySection
              key={category}
              title={category.charAt(0).toUpperCase() + category.slice(1)}
              companions={MOCK_COMPANIONS[category]}
              viewAllUrl={`/category/${category}`}
            />
          ))}
        </div>
      </div>
      </ScrollArea>
  );
};

export default Home;
