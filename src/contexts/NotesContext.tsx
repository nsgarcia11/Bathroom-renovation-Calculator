'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { ConstructionCategory } from './EstimateContext';

interface WorkflowNote {
  category: ConstructionCategory;
  categoryName: string;
  contractorNotes: string;
  clientNotes: string;
  hasContractorNotes: boolean;
  hasClientNotes: boolean;
  hasNotes: boolean;
}

interface NotesContextType {
  isNotesOpen: boolean;
  workflowNotes: WorkflowNote[];
  setWorkflowNotes: (notes: WorkflowNote[]) => void;
  openNotes: () => void;
  closeNotes: () => void;
  toggleNotes: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

interface NotesProviderProps {
  children: ReactNode;
}

export function NotesProvider({ children }: NotesProviderProps) {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [workflowNotes, setWorkflowNotes] = useState<WorkflowNote[]>([]);

  const openNotes = useCallback(() => {
    setIsNotesOpen(true);
  }, []);

  const closeNotes = useCallback(() => {
    setIsNotesOpen(false);
  }, []);

  const toggleNotes = useCallback(() => {
    setIsNotesOpen((prev) => !prev);
  }, []);

  return (
    <NotesContext.Provider
      value={{
        isNotesOpen,
        workflowNotes,
        setWorkflowNotes,
        openNotes,
        closeNotes,
        toggleNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
