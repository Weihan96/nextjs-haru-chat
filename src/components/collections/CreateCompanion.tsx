"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { createCompanion, getAllTags, searchTags } from '@/actions';
import type { CreateCompanionData } from '@/actions';

interface Tag {
  id: string;
  name: string;
  description?: string | null;
  companionCount?: number;
}

const CreateCompanion = () => {
  const [formData, setFormData] = useState<CreateCompanionData>({
    name: '',
    description: '',
    imageUrl: '',
    systemPrompt: '',
    startMessage: '',
    generationConfig: {
      temperature: 0.8,
      maxTokens: 500,
      topP: 0.9
    },
    isPublic: false,
    tagIds: []
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Load available tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to load tags:', error);
        toast.error('Failed to load tags');
      } finally {
        setIsLoadingTags(false);
      }
    };

    loadTags();
  }, []);

  // Search tags when tagSearch changes
  useEffect(() => {
    if (tagSearch.trim()) {
      const searchForTags = async () => {
        try {
          const results = await searchTags(tagSearch);
          setAvailableTags(results);
        } catch (error) {
          console.error('Failed to search tags:', error);
        }
      };
      searchForTags();
    } else {
      // Reset to all tags when search is cleared
      const loadAllTags = async () => {
        try {
          const tags = await getAllTags();
          setAvailableTags(tags);
        } catch (error) {
          console.error('Failed to load tags:', error);
        }
      };
      loadAllTags();
    }
  }, [tagSearch]);

  const handleInputChange = (
    field: keyof CreateCompanionData,
    value: string | boolean | object
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerationConfigChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      generationConfig: {
        ...prev.generationConfig,
        [field]: value
      }
    }));
  };

  const addTag = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      const newSelectedTags = [...selectedTags, tag];
      setSelectedTags(newSelectedTags);
      setFormData(prev => ({
        ...prev,
        tagIds: newSelectedTags.map(t => t.id)
      }));
    }
  };

  const removeTag = (tagId: string) => {
    const newSelectedTags = selectedTags.filter(t => t.id !== tagId);
    setSelectedTags(newSelectedTags);
    setFormData(prev => ({
      ...prev,
      tagIds: newSelectedTags.map(t => t.id)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a companion name');
      return;
    }

    if (!formData.systemPrompt.trim()) {
      toast.error('Please enter a system prompt');
      return;
    }

    if (!formData.startMessage.trim()) {
      toast.error('Please enter a start message');
      return;
    }

    setIsLoading(true);

    try {
      await createCompanion(formData);
      toast.success('Companion created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        systemPrompt: '',
        startMessage: '',
        generationConfig: {
          temperature: 0.8,
          maxTokens: 500,
          topP: 0.9
        },
        isPublic: false,
        tagIds: []
      });
      setSelectedTags([]);
    } catch (error) {
      console.error('Failed to create companion:', error);
      toast.error('Failed to create companion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Companion</h1>
        <p className="text-muted-foreground mt-2">
          Create your own AI companion with custom personality and behavior.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Set up the basic details for your companion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter companion name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your companion's personality and role"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                  />
                  <Label htmlFor="isPublic">Make this companion public</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help others discover your companion.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tagSearch">Search and add tags</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tagSearch"
                      value={tagSearch}
                      onChange={(e) => setTagSearch(e.target.value)}
                      placeholder="Search for tags..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {selectedTags.length > 0 && (
                  <div>
                    <Label>Selected tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="default"
                          className="pr-1"
                        >
                          {tag.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-1 hover:bg-transparent"
                            onClick={() => removeTag(tag.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoadingTags && (
                  <div>
                    <Label>Available tags</Label>
                    <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                      {availableTags
                        .filter(tag => !selectedTags.some(selected => selected.id === tag.id))
                        .map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="cursor-pointer hover:bg-accent"
                            onClick={() => addTag(tag)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {tag.name}
                            {tag.companionCount !== undefined && (
                              <span className="ml-1 text-xs opacity-60">
                                ({tag.companionCount})
                              </span>
                            )}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personality & Behavior</CardTitle>
                <CardDescription>
                  Define how your companion thinks and responds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="systemPrompt">System Prompt *</Label>
                  <Textarea
                    id="systemPrompt"
                    value={formData.systemPrompt}
                    onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                    placeholder="You are a helpful and friendly AI assistant who..."
                    rows={6}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This defines your companion's personality and behavior guidelines.
                  </p>
                </div>

                <div>
                  <Label htmlFor="startMessage">Start Message *</Label>
                  <Textarea
                    id="startMessage"
                    value={formData.startMessage}
                    onChange={(e) => handleInputChange('startMessage', e.target.value)}
                    placeholder="Hello! I'm here to help you with..."
                    rows={3}
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    The first message your companion will send to users.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>
                  Fine-tune how your companion generates responses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="temperature">
                    Temperature: {(formData.generationConfig as any).temperature}
                  </Label>
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={(formData.generationConfig as any).temperature}
                    onChange={(e) => handleGenerationConfigChange('temperature', parseFloat(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls randomness. Lower = more focused, Higher = more creative.
                  </p>
                </div>

                <div>
                  <Label htmlFor="maxTokens">
                    Max Tokens: {(formData.generationConfig as any).maxTokens}
                  </Label>
                  <Input
                    id="maxTokens"
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={(formData.generationConfig as any).maxTokens}
                    onChange={(e) => handleGenerationConfigChange('maxTokens', parseInt(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum length of generated responses.
                  </p>
                </div>

                <div>
                  <Label htmlFor="topP">
                    Top P: {(formData.generationConfig as any).topP}
                  </Label>
                  <Input
                    id="topP"
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={(formData.generationConfig as any).topP}
                    onChange={(e) => handleGenerationConfigChange('topP', parseFloat(e.target.value))}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls diversity via nucleus sampling.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Companion'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompanion;
