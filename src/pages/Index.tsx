import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '@/hooks/useSessions';
import { BackupTools } from '@/components/BackupTools';
import { NewSessionDialog } from '@/components/NewSessionDialog';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Smile, Meh, Moon, Clock, Settings } from 'lucide-react';

const moodIcons = {
  happy: <Smile size={16} className="text-success" />,
  neutral: <Meh size={16} className="text-accent" />,
  tired: <Moon size={16} className="text-muted-foreground" />,
};

const Index = () => {
  const { sessions, addSession, importData } = useSessions();
  const [showNew, setShowNew] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-bold font-handwriting text-primary">
              Vocab Log
            </h1>
            <p className="text-muted-foreground mt-1">Your digital vocabulary notebook 📒</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="text-muted-foreground"
            >
              <Settings size={20} />
            </Button>
            <Button onClick={() => setShowNew(true)} className="gap-1.5">
              <Plus size={18} /> New Session
            </Button>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="notebook-card space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Backup & Data
            </h3>
            <BackupTools onImport={importData} />
            <p className="text-xs text-muted-foreground">
              Data is stored in your browser's localStorage. Export regularly to keep a backup.
            </p>
          </div>
        )}

        {/* Session list */}
        {sortedSessions.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <BookOpen size={48} className="mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">No sessions yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedSessions.map(session => {
              const mastered = session.entries.filter(e => e.mastered).length;
              const total = session.entries.length;
              
              return (
                <button
                  key={session.id}
                  onClick={() => navigate(`/session/${session.id}`)}
                  className="notebook-card w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{session.topic}</h3>
                        {moodIcons[session.mood]}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span>{session.date}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {session.timeSpent}m
                        </span>
                        <span>{total} word{total !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4">
                      {total > 0 ? (
                        <span className={mastered === total ? 'mastery-badge-success' : 'mastery-badge-pending'}>
                          {mastered}/{total} mastered
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">empty</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showNew && (
        <NewSessionDialog
          onSave={(session) => {
            addSession(session);
            setShowNew(false);
            navigate(`/session/${session.id}`);
          }}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  );
};

export default Index;
