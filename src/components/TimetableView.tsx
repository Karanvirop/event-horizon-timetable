
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, MapPin } from 'lucide-react';
import { TimetableEvent, Subject } from '@/pages/Index';

interface TimetableViewProps {
  events: TimetableEvent[];
  subjects: Subject[];
  onEditEvent: (event: TimetableEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const TimetableView: React.FC<TimetableViewProps> = ({
  events,
  subjects,
  onEditEvent,
  onDeleteEvent,
}) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const getSubject = (subjectId: string) => subjects.find(s => s.id === subjectId);

  const getEventsForDayAndTime = (day: number, time: string) => {
    return events.filter(event => {
      const eventTime = parseInt(event.startTime.split(':')[0]);
      const slotTime = parseInt(time.split(':')[0]);
      const eventEndTime = parseInt(event.endTime.split(':')[0]);
      
      return event.day === day && slotTime >= eventTime && slotTime < eventEndTime;
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full">
      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-8 gap-1">
            {/* Header */}
            <div className="p-4 font-semibold text-center">Time</div>
            {days.map((day, index) => (
              <div key={day} className="p-4 font-semibold text-center bg-muted rounded-t-lg">
                {day}
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.slice(7, 22).map((time) => (
              <React.Fragment key={time}>
                <div className="p-2 text-sm font-medium text-center border-r">
                  {formatTime(time)}
                </div>
                {days.map((_, dayIndex) => {
                  const dayEvents = getEventsForDayAndTime(dayIndex, time);
                  return (
                    <div key={`${dayIndex}-${time}`} className="min-h-[60px] border border-border relative">
                      {dayEvents.map((event) => {
                        const subject = getSubject(event.subjectId);
                        const duration = parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0]);
                        
                        return (
                          <div
                            key={event.id}
                            className="absolute inset-1 rounded p-2 text-white text-xs overflow-hidden group cursor-pointer"
                            style={{
                              backgroundColor: subject?.color || '#3B82F6',
                              height: `${duration * 60 - 8}px`,
                            }}
                            onClick={() => onEditEvent(event)}
                          >
                            <div className="font-semibold truncate">{event.title}</div>
                            <div className="text-xs opacity-90">
                              {formatTime(event.startTime)} - {formatTime(event.endTime)}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs opacity-90">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                            
                            {/* Action buttons */}
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditEvent(event);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteEvent(event.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {days.map((day, dayIndex) => {
          const dayEvents = events
            .filter(event => event.day === dayIndex)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <Card key={day}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">{day}</h3>
                {dayEvents.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No events scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((event) => {
                      const subject = getSubject(event.subjectId);
                      return (
                        <div
                          key={event.id}
                          className="p-3 rounded-lg text-white relative"
                          style={{ backgroundColor: subject?.color || '#3B82F6' }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold">{event.title}</div>
                              <div className="text-sm opacity-90">
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1 text-sm opacity-90 mt-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {subject?.name}
                              </Badge>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                                onClick={() => onEditEvent(event)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={() => onDeleteEvent(event.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TimetableView;
