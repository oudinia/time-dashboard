import { useState } from 'react';
import { Plus, ChevronDown, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDashboardStore } from '@/stores/dashboardStore';
import { cn } from '@/lib/utils';

export function DashboardSwitcher() {
  const {
    dashboards,
    activeDashboardId,
    setActiveDashboard,
    addDashboard,
    updateDashboard,
    deleteDashboard,
  } = useDashboardStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const activeDashboard = dashboards.find((d) => d.id === activeDashboardId);

  const handleCreate = () => {
    const name = `Dashboard ${dashboards.length + 1}`;
    addDashboard(name);
    setIsOpen(false);
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEditing = () => {
    if (editingId && editingName.trim()) {
      updateDashboard(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: string) => {
    if (dashboards.length <= 1) return;
    if (confirm('Delete this dashboard? This cannot be undone.')) {
      deleteDashboard(id);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="min-w-[180px] justify-between"
      >
        <span className="truncate">{activeDashboard?.name || 'Select Dashboard'}</span>
        <ChevronDown className={cn('w-4 h-4 ml-2 transition-transform', isOpen && 'rotate-180')} />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-64 rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
            <div className="p-1 max-h-72 overflow-y-auto">
              {dashboards.map((dashboard) => (
                <div
                  key={dashboard.id}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1.5 rounded',
                    dashboard.id === activeDashboardId && 'bg-neutral-100 dark:bg-neutral-800'
                  )}
                >
                  {editingId === dashboard.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-7 text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={saveEditing}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={cancelEditing}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="flex-1 text-left text-sm truncate py-0.5"
                        onClick={() => {
                          setActiveDashboard(dashboard.id);
                          setIsOpen(false);
                        }}
                      >
                        {dashboard.name}
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 opacity-60 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(dashboard.id, dashboard.name);
                        }}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      {dashboards.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-60 hover:opacity-100 text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(dashboard.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-800 p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={handleCreate}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Dashboard
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
