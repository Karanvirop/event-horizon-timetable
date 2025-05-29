
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TimetableEvent, Subject } from '@/pages/Index';

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjects: Subject[];
  onAddEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  onEditEvent: (event: TimetableEvent) => void;
  editingEvent: TimetableEvent | null;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({
  open,
  onOpenChange,
  subjects,
  onAddEvent,
  onEditEvent,
  editingEvent,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    day: 0,
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    notes: '',
    recurring: true,
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        subjectId: editingEvent.subjectId,
        day: editingEvent.day,
        startTime: editingEvent.startTime,
        endTime: editingEvent.endTime,
        location: editingEvent.location || '',
        notes: editingEvent.notes || '',
        recurring: editingEvent.recurring,
      });
    } else {
      setFormData({
        title: '',
        subjectId: '',
        day: 0,
        startTime: '09:00',
        endTime: '10:00',
        location: '',
        notes: '',
        recurring: true,
      });
    }
  }, [editingEvent, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subjectId) {
      return;
    }

    if (editingEvent) {
      onEditEvent({
        ...editingEvent,
        ...formData,
      });
    } else {
      onAddEvent(formData);
    }
    
    onOpenChange(false);
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Calculus Lecture"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={formData.day.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, day: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day, index) => (
                    <SelectItem key={day} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, endTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Room 101, Main Building"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes or reminders"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, recurring: checked }))}
            />
            <Label htmlFor="recurring">Recurring weekly event</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingEvent ? 'Update Event' : 'Add Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
