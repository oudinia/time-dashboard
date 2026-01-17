import { useState } from 'react';
import { Plus, Pencil, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TimezoneSelector } from './TimezoneSelector';
import { useTimezoneStore } from '@/stores/timezoneStore';
import { TimeZoneSlot, TimeZoneSlotFormData } from '@/types/timezone';
import { MEMBER_COLORS } from '@/lib/utils';
import { getTimezoneOffset } from '@/lib/timezone';

interface TimezoneFormProps {
  slot?: TimeZoneSlot;
  onSubmit: (data: TimeZoneSlotFormData) => void;
  onCancel: () => void;
}

function TimezoneForm({ slot, onSubmit, onCancel }: TimezoneFormProps) {
  const [formData, setFormData] = useState<TimeZoneSlotFormData>({
    timezone: slot?.timezone || 'America/New_York',
    label: slot?.label || '',
    workingHours: slot?.workingHours || { start: '09:00', end: '17:00' },
    color: slot?.color || MEMBER_COLORS[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g., East Coast Office"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Timezone</Label>
        <TimezoneSelector
          value={formData.timezone}
          onChange={(tz) => setFormData({ ...formData, timezone: tz })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="workStart">Work Start</Label>
          <Input
            id="workStart"
            type="time"
            value={formData.workingHours?.start || '09:00'}
            onChange={(e) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours!, start: e.target.value },
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workEnd">Work End</Label>
          <Input
            id="workEnd"
            type="time"
            value={formData.workingHours?.end || '17:00'}
            onChange={(e) =>
              setFormData({
                ...formData,
                workingHours: { ...formData.workingHours!, end: e.target.value },
              })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="flex flex-wrap gap-2">
          {MEMBER_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                formData.color === color ? 'border-neutral-900 dark:border-white scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{slot ? 'Update' : 'Add'} Timezone</Button>
      </div>
    </form>
  );
}

export function TimezoneManager() {
  const { slots, addSlot, updateSlot, deleteSlot } = useTimezoneStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeZoneSlot | undefined>();

  const handleAdd = () => {
    setEditingSlot(undefined);
    setIsDialogOpen(true);
  };

  const handleEdit = (slot: TimeZoneSlot) => {
    setEditingSlot(slot);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this timezone?')) {
      deleteSlot(id);
    }
  };

  const handleSubmit = (data: TimeZoneSlotFormData) => {
    if (editingSlot) {
      updateSlot(editingSlot.id, data);
    } else {
      addSlot(data);
    }
    setIsDialogOpen(false);
    setEditingSlot(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Timezones</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Add Timezone
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {slots.map((slot) => (
          <Card key={slot.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: slot.color }}
                />
                <div>
                  <h3 className="font-medium">{slot.label}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {slot.timezone.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">
                    {getTimezoneOffset(slot.timezone)}
                  </p>
                  {slot.workingHours && (
                    <p className="text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {slot.workingHours.start} - {slot.workingHours.end}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEdit(slot)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(slot.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSlot ? 'Edit' : 'Add'} Timezone</DialogTitle>
          </DialogHeader>
          <TimezoneForm
            slot={editingSlot}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
