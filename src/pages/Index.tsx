
import React, { useState } from 'react';
import TimetableView from '@/components/TimetableView';
import AddEventDialog from '@/components/AddEventDialog';
import SubjectManager from '@/components/SubjectManager';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Calendar, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface TimetableEvent {
  id: string;
  subjectId: string;
  title: string;
  day: number; // 0-6 (Monday-Sunday)
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  recurring: boolean;
}

const Index = () => {
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', color: '#3B82F6' },
    { id: '2', name: 'Physics', color: '#EF4444' },
    { id: '3', name: 'Chemistry', color: '#10B981' },
    { id: '4', name: 'English', color: '#F59E0B' },
    { id: '5', name: 'History', color: '#8B5CF6' },
  ]);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const { theme, setTheme } = useTheme();

  const handleAddEvent = (event: Omit<TimetableEvent, 'id'>) => {
    const newEvent: TimetableEvent = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
    setIsAddEventOpen(false);
  };

  const handleEditEvent = (event: TimetableEvent) => {
    setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    setEditingEvent(null);
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Timetable</h1>
            <p className="text-muted-foreground">Manage your schedule efficiently</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => {
                setEditingEvent(null);
                setIsAddEventOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="timetable" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timetable" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <Settings className="h-4 w-4" />
              Subjects
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="mt-6">
            <TimetableView
              events={events}
              subjects={subjects}
              onEditEvent={(event) => {
                setEditingEvent(event);
                setIsAddEventOpen(true);
              }}
              onDeleteEvent={handleDeleteEvent}
            />
          </TabsContent>
          
          <TabsContent value="subjects" className="mt-6">
            <SubjectManager
              subjects={subjects}
              setSubjects={setSubjects}
            />
          </TabsContent>
        </Tabs>

        {/* Add/Edit Event Dialog */}
        <AddEventDialog
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          subjects={subjects}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          editingEvent={editingEvent}
        />
      </div>
    </div>
  );
};

export default Index;
