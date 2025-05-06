"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface ProjectsContextType {
  isExpanded: boolean;
  toggleExpand: () => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Add class on initial load
    document.body.classList.add('projects-collapsed');
    
    return () => {
      document.body.classList.remove('projects-collapsed');
    };
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      document.body.classList.add('projects-collapsed');
    } else {
      document.body.classList.remove('projects-collapsed');
    }
  };

  return (
    <ProjectsContext.Provider value={{ isExpanded, toggleExpand }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
} 