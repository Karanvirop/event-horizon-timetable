import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Palette } from 'lucide-react';
import { Subject } from '@/pages/Index';

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ subjects, setSubjects }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({ name: '', color: '#3B82F6' });

  const predefinedColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name.trim(),
        color: newSubject.color,
      };
      setSubjects(prev => [...prev, subject]);
      setNewSubject({ name: '', color: '#3B82F6' });
      setIsAdding(false);
    }
  };

  const handleUpdateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    ));
    setEditingId(null);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Manage Subjects
            <Button
              onClick={() => setIsAdding(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new subject form */}
          {isAdding && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subjectName">Subject Name</Label>
                    <Input
                      id="subjectName"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Mathematics"
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <Label>Color</Label>
                    <div className="flex gap-2 mt-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newSubject.color === color ? 'border-foreground scale-110' : 'border-border'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewSubject(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddSubject} size="sm">
                      Add Subject
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setIsAdding(false);
                        setNewSubject({ name: '', color: '#3B82F6' });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing subjects */}
          <div className="grid gap-3">
            {subjects.map((subject) => (
              <Card key={subject.id} className="transition-all hover:shadow-md">
                <CardContent className="p-4">
                  {editingId === subject.id ? (
                    <EditSubjectForm
                      subject={subject}
                      onUpdate={handleUpdateSubject}
                      onCancel={() => setEditingId(null)}
                      predefinedColors={predefinedColors}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-border"
                          style={{ backgroundColor: subject.color }}
                        />
                        <div>
                          <h3 className="font-semibold">{subject.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {subject.color}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingId(subject.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {subjects.length === 0 && !isAdding && (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subjects yet. Add your first subject to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface EditSubjectFormProps {
  subject: Subject;
  onUpdate: (id: string, updates: Partial<Subject>) => void;
  onCancel: () => void;
  predefinedColors: string[];
}

const EditSubjectForm: React.FC<EditSubjectFormProps> = ({
  subject,
  onUpdate,
  onCancel,
  predefinedColors,
}) => {
  const [name, setName] = useState(subject.name);
  const [color, setColor] = useState(subject.color);

  const handleSubmit = () => {
    if (name.trim()) {
      onUpdate(subject.id, { name: name.trim(), color });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="editName">Subject Name</Label>
        <Input
          id="editName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      
      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-2">
          {predefinedColors.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === colorOption ? 'border-foreground scale-110' : 'border-border'
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSubmit} size="sm">
          Update
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SubjectManager;
