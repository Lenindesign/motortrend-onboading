/**
 * Journey Builder
 * Visual drag-and-drop interface for managing personalized home page experiences
 * Supports 8 experience versions based on user vehicle data and shopping intent
 * 
 * Uses Supabase for persistence when configured, falls back to localStorage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../components/Icon';
import homePageLayouts from '../../config/homePageLayouts.json';
import {
  getLayouts,
  updateLayout,
  getVersionHistory,
  restoreVersion,
  seedInitialData,
  checkConnection,
  subscribeToLayoutChanges,
  type LayoutKey,
  type LayoutConfig,
  type VersionInfo,
} from '../../services/journeyLayoutService';
import type { SectionConfig } from '../../lib/supabase';
import './JourneyBuilder.css';

// Types
interface ComponentProp {
  type: 'text' | 'number' | 'boolean' | 'select';
  default: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
}

interface ComponentDefinition {
  id: string;
  name: string;
  description: string;
  type: 'full-width' | 'two-column';
  icon: string;
  props: Record<string, ComponentProp>;
}

// Component definitions from config
const componentDefinitions = homePageLayouts.components as Record<string, ComponentDefinition>;

// Sortable Item Component
const SortableItem: React.FC<{
  id: string;
  section: SectionConfig;
  index: number;
  onToggle: (index: number) => void;
  onRemove: (index: number) => void;
  onEditProps: (index: number) => void;
  isSelected: boolean;
  onSelect: (index: number) => void;
}> = ({ id, section, index, onToggle, onRemove, onEditProps, isSelected, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const component = componentDefinitions[section.componentId];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`journey-builder__canvas-item ${!section.enabled ? 'journey-builder__canvas-item--disabled' : ''} ${isSelected ? 'journey-builder__canvas-item--selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className="journey-builder__canvas-item-drag" {...attributes} {...listeners}>
        <Icon name="drag_indicator" size={20} />
      </div>
      <div className="journey-builder__canvas-item-icon">
        <Icon name={component?.icon || 'widgets'} size={24} />
      </div>
      <div className="journey-builder__canvas-item-content">
        <div className="journey-builder__canvas-item-header">
          <span className="journey-builder__canvas-item-index">{index + 1}</span>
          <span className="journey-builder__canvas-item-name">{component?.name || section.componentId}</span>
          <span className={`journey-builder__canvas-item-type journey-builder__canvas-item-type--${component?.type || 'full-width'}`}>
            {component?.type === 'two-column' ? '2-col' : 'full'}
          </span>
        </div>
        <p className="journey-builder__canvas-item-description">{component?.description}</p>
      </div>
      <div className="journey-builder__canvas-item-actions">
        <button
          className="journey-builder__canvas-item-btn"
          onClick={(e) => { e.stopPropagation(); onEditProps(index); }}
          title="Edit Props"
        >
          <Icon name="settings" size={16} />
        </button>
        <button
          className={`journey-builder__canvas-item-btn ${section.enabled ? '' : 'journey-builder__canvas-item-btn--inactive'}`}
          onClick={(e) => { e.stopPropagation(); onToggle(index); }}
          title={section.enabled ? 'Disable' : 'Enable'}
        >
          <Icon name={section.enabled ? 'visibility' : 'visibility_off'} size={16} />
        </button>
        <button
          className="journey-builder__canvas-item-btn journey-builder__canvas-item-btn--danger"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          title="Remove"
        >
          <Icon name="delete" size={16} />
        </button>
      </div>
    </div>
  );
};

// Drop Indicator Component
const DropIndicator: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className={`journey-builder__drop-indicator ${isActive ? 'journey-builder__drop-indicator--active' : ''}`}>
      <div className="journey-builder__drop-indicator-line" />
      <span className="journey-builder__drop-indicator-text">Drop here</span>
    </div>
  );
};

// Canvas Drop Zone (for dropping at the end)
const CanvasDropZone: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`journey-builder__canvas-drop-zone ${isOver || isActive ? 'journey-builder__canvas-drop-zone--active' : ''}`}
    >
      <Icon name="add_circle_outline" size={24} />
      <span>Drop component here to add at end</span>
    </div>
  );
};

// Draggable Palette Item
const PaletteItem: React.FC<{
  component: ComponentDefinition;
  onAdd: (componentId: string) => void;
  onPreview: (component: ComponentDefinition) => void;
}> = ({ component, onAdd, onPreview }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${component.id}`,
    data: {
      type: 'palette',
      componentId: component.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`journey-builder__palette-item ${isDragging ? 'journey-builder__palette-item--dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <div 
        className="journey-builder__palette-item-info"
        onClick={() => onPreview(component)}
        title="Click to preview, drag to add"
      >
        <div className="journey-builder__palette-item-icon">
          <Icon name={component.icon || 'widgets'} size={24} />
        </div>
        <div className="journey-builder__palette-item-content">
          <span className="journey-builder__palette-item-name">{component.name}</span>
          <span className={`journey-builder__palette-item-type journey-builder__palette-item-type--${component.type}`}>
            {component.type === 'two-column' ? '2-col' : 'full'}
          </span>
        </div>
      </div>
      <button 
        className="journey-builder__palette-item-add"
        onClick={(e) => { e.stopPropagation(); onAdd(component.id); }}
        title="Add to end of layout"
      >
        <Icon name="add" size={16} />
      </button>
    </div>
  );
};

// Props Editor Modal
const PropsEditor: React.FC<{
  section: SectionConfig;
  onSave: (props: Record<string, string | number | boolean>) => void;
  onClose: () => void;
}> = ({ section, onSave, onClose }) => {
  const [editedProps, setEditedProps] = useState<Record<string, string | number | boolean>>(section.props);
  const component = componentDefinitions[section.componentId];

  const handleChange = (key: string, value: string | number | boolean) => {
    setEditedProps(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="journey-builder__modal-overlay" onClick={onClose}>
      <div className="journey-builder__modal" onClick={e => e.stopPropagation()}>
        <div className="journey-builder__modal-header">
          <h3>Edit {component?.name} Props</h3>
          <button className="journey-builder__modal-close" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="journey-builder__modal-content">
          {component && Object.entries(component.props).map(([key, propDef]) => (
            <div key={key} className="journey-builder__prop-field">
              <label>{key}</label>
              {propDef.type === 'text' && (
                <input
                  type="text"
                  value={String(editedProps[key] ?? propDef.default)}
                  onChange={e => handleChange(key, e.target.value)}
                />
              )}
              {propDef.type === 'number' && (
                <input
                  type="number"
                  value={Number(editedProps[key] ?? propDef.default)}
                  min={propDef.min}
                  max={propDef.max}
                  onChange={e => handleChange(key, parseInt(e.target.value))}
                />
              )}
              {propDef.type === 'boolean' && (
                <label className="journey-builder__checkbox">
                  <input
                    type="checkbox"
                    checked={Boolean(editedProps[key] ?? propDef.default)}
                    onChange={e => handleChange(key, e.target.checked)}
                  />
                  <span>{editedProps[key] ? 'Enabled' : 'Disabled'}</span>
                </label>
              )}
              {propDef.type === 'select' && propDef.options && (
                <select
                  value={String(editedProps[key] ?? propDef.default)}
                  onChange={e => handleChange(key, e.target.value)}
                >
                  {/* Add dynamic option for preferredBodyStyle */}
                  {key === 'initialVehicleType' && (
                    <option value="dynamic:preferredBodyStyle">Dynamic (User's Preferred)</option>
                  )}
                  {propDef.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          {Object.keys(component?.props || {}).length === 0 && (
            <p className="journey-builder__no-props">This component has no configurable props.</p>
          )}
        </div>
        <div className="journey-builder__modal-footer">
          <button className="journey-builder__btn journey-builder__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="journey-builder__btn journey-builder__btn--primary" onClick={() => { onSave(editedProps); onClose(); }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Preview Modal
const ComponentPreviewModal: React.FC<{
  component: ComponentDefinition;
  onClose: () => void;
  onAdd: (componentId: string) => void;
}> = ({ component, onClose, onAdd }) => {
  // Generate preview URL for the component
  const getPreviewUrl = () => {
    // We'll use a special preview route that renders just this component
    const baseUrl = window.location.origin;
    return `${baseUrl}/?componentPreview=${component.id}&preview=true`;
  };

  return (
    <div className="journey-builder__modal-overlay" onClick={onClose}>
      <div className="journey-builder__preview-modal" onClick={e => e.stopPropagation()}>
        <div className="journey-builder__modal-header">
          <div className="journey-builder__preview-modal-title">
            <Icon name={component.icon || 'widgets'} size={24} />
            <div>
              <h3>{component.name}</h3>
              <span className={`journey-builder__palette-item-type journey-builder__palette-item-type--${component.type}`}>
                {component.type === 'two-column' ? 'Two Column' : 'Full Width'}
              </span>
            </div>
          </div>
          <button className="journey-builder__modal-close" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        
        <div className="journey-builder__preview-modal-content">
          <p className="journey-builder__preview-modal-description">{component.description}</p>
          
          {/* Live Preview iframe */}
          <div className="journey-builder__preview-modal-iframe-container">
            <iframe
              src={getPreviewUrl()}
              className="journey-builder__preview-modal-iframe"
              title={`Preview: ${component.name}`}
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
          
          {/* Props info */}
          {Object.keys(component.props).length > 0 && (
            <div className="journey-builder__preview-modal-props">
              <h4>Configurable Properties</h4>
              <div className="journey-builder__preview-modal-props-list">
                {Object.entries(component.props).map(([key, propDef]) => (
                  <div key={key} className="journey-builder__preview-modal-prop">
                    <span className="journey-builder__preview-modal-prop-name">{key}</span>
                    <span className="journey-builder__preview-modal-prop-type">{propDef.type}</span>
                    {propDef.options && (
                      <span className="journey-builder__preview-modal-prop-options">
                        {propDef.options.slice(0, 3).join(', ')}{propDef.options.length > 3 ? '...' : ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="journey-builder__modal-footer">
          <button className="journey-builder__btn journey-builder__btn--secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="journey-builder__btn journey-builder__btn--primary" 
            onClick={() => { onAdd(component.id); onClose(); }}
          >
            <Icon name="add" size={16} />
            Add to Layout
          </button>
        </div>
      </div>
    </div>
  );
};

// Version History Panel
const VersionHistoryPanel: React.FC<{
  versions: VersionInfo[];
  isLoading: boolean;
  onRestore: (versionId: string) => void;
  isRestoring: boolean;
}> = ({ versions, isLoading, onRestore, isRestoring }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="journey-builder__versions">
      <h3 className="journey-builder__versions-title">
        <Icon name="history" size={18} />
        Version History
      </h3>
      {isLoading ? (
        <div className="journey-builder__versions-loading">
          <Icon name="sync" size={20} />
          Loading...
        </div>
      ) : versions.length === 0 ? (
        <p className="journey-builder__versions-empty">
          No version history yet. Changes will be tracked after first save.
        </p>
      ) : (
        <div className="journey-builder__versions-list">
          {versions.map((version) => (
            <div key={version.id} className="journey-builder__version-item">
              <div className="journey-builder__version-info">
                <span className="journey-builder__version-number">v{version.versionNumber}</span>
                <span className="journey-builder__version-date">{formatDate(version.createdAt)}</span>
              </div>
              <button
                className="journey-builder__version-restore"
                onClick={() => onRestore(version.id)}
                disabled={isRestoring}
                title="Restore this version"
              >
                <Icon name="restore" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Experience Tab
const ExperienceTab: React.FC<{
  layout: LayoutConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ layout, isActive, onClick }) => {
  // Determine Want/Own status based on experience
  const hasWant = layout.experience === 'A' || layout.experience === 'B';
  const hasOwn = layout.experience === 'A' || layout.experience === 'C';

  return (
    <button
      className={`journey-builder__tab ${isActive ? 'journey-builder__tab--active' : ''}`}
      onClick={onClick}
    >
      <div className="journey-builder__tab-experience">
        <span className="journey-builder__tab-letter">{layout.experience}</span>
        <span className={`journey-builder__tab-shopper ${layout.isShopper ? 'journey-builder__tab-shopper--yes' : ''}`}>
          {layout.isShopper ? 'Shopper' : 'Browser'}
        </span>
      </div>
      <div className="journey-builder__tab-vehicles">
        <div className="journey-builder__tab-vehicle">
          <Icon name="favorite" size={14} />
          <span>Want</span>
          <span style={{ color: hasWant ? 'var(--color-success, #58BD7D)' : 'var(--color-error, #E53935)' }}>
            <Icon name={hasWant ? 'check_circle' : 'cancel'} size={14} />
          </span>
        </div>
        <div className="journey-builder__tab-vehicle">
          <Icon name="directions_car" size={14} />
          <span>Own</span>
          <span style={{ color: hasOwn ? 'var(--color-success, #58BD7D)' : 'var(--color-error, #E53935)' }}>
            <Icon name={hasOwn ? 'check_circle' : 'cancel'} size={14} />
          </span>
        </div>
      </div>
    </button>
  );
};

// Main Journey Builder Component
export const JourneyBuilder: React.FC = () => {
  const [activeLayout, setActiveLayout] = useState<LayoutKey>('D-browser');
  const [layouts, setLayouts] = useState<Record<LayoutKey, LayoutConfig>>(
    homePageLayouts.layouts as Record<LayoutKey, LayoutConfig>
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [previewMode, setPreviewMode] = useState<'live' | 'blocks'>('live');
  const [previewComponent, setPreviewComponent] = useState<ComponentDefinition | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts, allows clicks to work
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentLayout = layouts[activeLayout];
  const sections = currentLayout?.sections || [];

  // Load layouts on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check connection
        const connected = await checkConnection();
        setIsConnected(connected);

        // Load layouts
        const loadedLayouts = await getLayouts();
        setLayouts(loadedLayouts);
      } catch (error) {
        console.error('Error loading layouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsubscribe = subscribeToLayoutChanges((layoutKey, newSections) => {
      setLayouts(prev => ({
        ...prev,
        [layoutKey]: {
          ...prev[layoutKey],
          sections: newSections,
        },
      }));
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Load version history when layout changes
  useEffect(() => {
    const loadVersions = async () => {
      if (!isConnected) return;
      
      setIsLoadingVersions(true);
      try {
        const history = await getVersionHistory(activeLayout);
        setVersions(history);
      } catch (error) {
        console.error('Error loading versions:', error);
      } finally {
        setIsLoadingVersions(false);
      }
    };

    if (showVersions) {
      loadVersions();
    }
  }, [activeLayout, isConnected, showVersions]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  // Handle drag over - for showing drop indicators
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    // Only show drop indicator when dragging from palette
    if (String(active.id).startsWith('palette-') && over) {
      const overId = String(over.id);
      if (overId.startsWith('section-')) {
        const index = parseInt(overId.replace('section-', ''));
        setDropTargetIndex(index);
      } else if (overId === 'canvas-drop-zone') {
        setDropTargetIndex(sections.length);
      } else {
        setDropTargetIndex(null);
      }
    } else {
      setDropTargetIndex(null);
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeIdStr = String(active.id);
    setActiveId(null);
    setDropTargetIndex(null);

    // Check if dragging from palette
    if (activeIdStr.startsWith('palette-')) {
      const componentId = activeIdStr.replace('palette-', '');
      
      if (over) {
        const overId = String(over.id);
        let insertIndex = sections.length; // Default to end
        
        if (overId.startsWith('section-')) {
          insertIndex = parseInt(overId.replace('section-', ''));
        } else if (overId === 'canvas-drop-zone') {
          insertIndex = sections.length;
        }
        
        // Create new section
        const component = componentDefinitions[componentId];
        const defaultProps: Record<string, string | number | boolean> = {};
        
        if (component) {
          Object.entries(component.props).forEach(([key, propDef]) => {
            defaultProps[key] = propDef.default;
          });
        }

        const newSection: SectionConfig = {
          componentId,
          props: defaultProps,
          enabled: true,
        };

        // Insert at the correct position
        const newSections = [...sections];
        newSections.splice(insertIndex, 0, newSection);
        updateSections(newSections);
      }
      return;
    }

    // Handle reordering existing sections
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((_, i) => `section-${i}` === active.id);
      const newIndex = sections.findIndex((_, i) => `section-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        updateSections(newSections);
      }
    }
  };

  // Update sections
  const updateSections = useCallback((newSections: SectionConfig[]) => {
    setLayouts(prev => ({
      ...prev,
      [activeLayout]: {
        ...prev[activeLayout],
        sections: newSections,
      },
    }));
    setHasChanges(true);
  }, [activeLayout]);

  // Toggle section enabled
  const handleToggle = (index: number) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], enabled: !newSections[index].enabled };
    updateSections(newSections);
  };

  // Remove section
  const handleRemove = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    updateSections(newSections);
    setSelectedIndex(null);
  };

  // Add component
  const handleAddComponent = (componentId: string) => {
    const component = componentDefinitions[componentId];
    const defaultProps: Record<string, string | number | boolean> = {};
    
    if (component) {
      Object.entries(component.props).forEach(([key, propDef]) => {
        defaultProps[key] = propDef.default;
      });
    }

    const newSection: SectionConfig = {
      componentId,
      props: defaultProps,
      enabled: true,
    };

    updateSections([...sections, newSection]);
  };

  // Update props
  const handleUpdateProps = (index: number, props: Record<string, string | number | boolean>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], props };
    updateSections(newSections);
  };

  // Save changes
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const result = await updateLayout(activeLayout, sections);
      
      if (result.success) {
        setSaveStatus('saved');
        setHasChanges(false);
        
        // Reload versions
        if (isConnected) {
          const history = await getVersionHistory(activeLayout);
          setVersions(history);
        }
        
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Save error:', result.error);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Restore version
  const handleRestoreVersion = async (versionId: string) => {
    setIsRestoring(true);
    try {
      const result = await restoreVersion(activeLayout, versionId);
      
      if (result.success && result.sections) {
        setLayouts(prev => ({
          ...prev,
          [activeLayout]: {
            ...prev[activeLayout],
            sections: result.sections!,
          },
        }));
        setHasChanges(false);
        
        // Reload versions
        const history = await getVersionHistory(activeLayout);
        setVersions(history);
      } else {
        console.error('Restore error:', result.error);
      }
    } catch (error) {
      console.error('Error restoring version:', error);
    } finally {
      setIsRestoring(false);
    }
  };

  // Seed initial data
  const handleSeedData = async () => {
    const result = await seedInitialData();
    if (result.success) {
      // Reload layouts
      const loadedLayouts = await getLayouts();
      setLayouts(loadedLayouts);
    }
  };

  // Preview URL - includes useDynamicLayout=true to enable Journey Builder rendering
  const getPreviewUrl = () => {
    const params = new URLSearchParams({
      experience: currentLayout.experience,
      isShopper: String(currentLayout.isShopper),
      preview: 'true',
      useDynamicLayout: 'true', // Enable dynamic rendering from Journey Builder
    });
    return `/?${params.toString()}`;
  };
  
  // Enable dynamic layout mode globally
  const enableDynamicMode = () => {
    localStorage.setItem('dynamicLayoutEnabled', 'true');
    alert('Dynamic Layout Mode enabled! The home page will now use Journey Builder configurations.');
  };
  
  // Disable dynamic layout mode
  const disableDynamicMode = () => {
    localStorage.removeItem('dynamicLayoutEnabled');
    alert('Dynamic Layout Mode disabled. The home page will use default rendering.');
  };
  
  // Check if dynamic mode is enabled
  const isDynamicModeEnabled = () => {
    try {
      return localStorage.getItem('dynamicLayoutEnabled') === 'true';
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="journey-builder journey-builder--loading">
        <div className="journey-builder__loading-content">
          <Icon name="sync" size={48} />
          <p>Loading Journey Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="journey-builder">
      {/* Header */}
      <header className="journey-builder__header">
        <div className="journey-builder__header-left">
          <h1 className="journey-builder__title">
            <Icon name="route" size={28} />
            Journey Builder
          </h1>
          <span className="journey-builder__subtitle">
            Design personalized experiences for different user journeys
          </span>
        </div>
        <div className="journey-builder__header-actions">
          {/* Connection status */}
          <span className={`journey-builder__connection ${isConnected ? 'journey-builder__connection--connected' : ''}`}>
            <Icon name={isConnected ? 'cloud_done' : 'cloud_off'} size={16} />
            {isConnected ? 'Supabase' : 'Local'}
          </span>
          
          {hasChanges && (
            <span className="journey-builder__unsaved">Unsaved changes</span>
          )}
          
          {isConnected && (
            <button
              className={`journey-builder__btn journey-builder__btn--ghost ${showVersions ? 'journey-builder__btn--active' : ''}`}
              onClick={() => setShowVersions(!showVersions)}
              title="Version History"
            >
              <Icon name="history" size={16} />
              History
            </button>
          )}
          
          <a
            href={getPreviewUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="journey-builder__btn journey-builder__btn--secondary"
          >
            <Icon name="open_in_new" size={16} />
            Preview
          </a>
          
          {/* Dynamic Mode Toggle */}
          <button
            className={`journey-builder__btn ${isDynamicModeEnabled() ? 'journey-builder__btn--live' : 'journey-builder__btn--ghost'}`}
            onClick={isDynamicModeEnabled() ? disableDynamicMode : enableDynamicMode}
            title={isDynamicModeEnabled() ? 'Dynamic mode is ACTIVE - Click to disable' : 'Click to enable dynamic mode'}
          >
            <Icon name={isDynamicModeEnabled() ? 'check_circle' : 'toggle_off'} size={16} />
            {isDynamicModeEnabled() ? 'Live' : 'Enable'}
          </button>
          
          <button
            className={`journey-builder__btn journey-builder__btn--primary ${saveStatus === 'saving' ? 'journey-builder__btn--loading' : ''}`}
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Experience Tabs */}
      <div className="journey-builder__tabs">
        {(Object.entries(layouts) as [LayoutKey, LayoutConfig][]).map(([key, layout]) => (
          <ExperienceTab
            key={key}
            layout={layout}
            isActive={activeLayout === key}
            onClick={() => setActiveLayout(key)}
          />
        ))}
      </div>

      {/* Main Content - Wrapped in DndContext for drag-and-drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={`journey-builder__content ${showVersions ? 'journey-builder__content--with-versions' : ''}`}>
          {/* Component Palette */}
          <aside className="journey-builder__palette">
            <h2 className="journey-builder__palette-title">
              <Icon name="widgets" size={20} />
              Components
            </h2>
            <p className="journey-builder__palette-hint">Drag to canvas or click + to add</p>
            <div className="journey-builder__palette-list">
              {Object.values(componentDefinitions).map(component => (
                <PaletteItem
                  key={component.id}
                  component={component}
                  onAdd={handleAddComponent}
                  onPreview={setPreviewComponent}
                />
              ))}
            </div>
            
            {/* Seed data button (only show when connected but no sections) */}
            {isConnected && sections.length === 0 && (
              <button
                className="journey-builder__btn journey-builder__btn--secondary journey-builder__seed-btn"
                onClick={handleSeedData}
              >
                <Icon name="upload" size={16} />
                Import from JSON
              </button>
            )}
          </aside>

          {/* Canvas */}
          <main className="journey-builder__canvas">
            <div className="journey-builder__canvas-header">
              <h2 className="journey-builder__canvas-title">
                {currentLayout.name}
              </h2>
              <p className="journey-builder__canvas-description">
                {currentLayout.description}
              </p>
            </div>

            <SortableContext
              items={sections.map((_, i) => `section-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="journey-builder__canvas-list">
                {sections.length === 0 ? (
                  <CanvasDropZone isActive={dropTargetIndex === 0} />
                ) : (
                  <>
                    {sections.map((section, index) => (
                      <React.Fragment key={`section-${index}`}>
                        {/* Drop indicator before this item */}
                        {dropTargetIndex === index && (
                          <DropIndicator isActive={true} />
                        )}
                        <SortableItem
                          id={`section-${index}`}
                          section={section}
                          index={index}
                          onToggle={handleToggle}
                          onRemove={handleRemove}
                          onEditProps={setEditingIndex}
                          isSelected={selectedIndex === index}
                          onSelect={setSelectedIndex}
                        />
                      </React.Fragment>
                    ))}
                    {/* Drop zone at the end */}
                    <CanvasDropZone isActive={dropTargetIndex === sections.length} />
                  </>
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && activeId.startsWith('palette-') && (
                <div className="journey-builder__palette-item journey-builder__palette-item--overlay">
                  <div className="journey-builder__palette-item-icon">
                    <Icon name={componentDefinitions[activeId.replace('palette-', '')]?.icon || 'widgets'} size={24} />
                  </div>
                  <div className="journey-builder__palette-item-content">
                    <span className="journey-builder__palette-item-name">
                      {componentDefinitions[activeId.replace('palette-', '')]?.name}
                    </span>
                  </div>
                </div>
              )}
              {activeId && activeId.startsWith('section-') && sections[parseInt(activeId.replace('section-', ''))] && (
                <div className="journey-builder__canvas-item journey-builder__canvas-item--dragging">
                  <div className="journey-builder__canvas-item-drag">
                    <Icon name="drag_indicator" size={20} />
                  </div>
                  <div className="journey-builder__canvas-item-content">
                    <span className="journey-builder__canvas-item-name">
                      {componentDefinitions[sections[parseInt(activeId.replace('section-', ''))].componentId]?.name}
                    </span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </main>

          {/* Preview Panel */}
          <aside className="journey-builder__preview">
          <div className="journey-builder__preview-header">
            <h2 className="journey-builder__preview-title">
              <Icon name="preview" size={20} />
              Preview
            </h2>
            <div className="journey-builder__preview-actions">
              {/* Preview Mode Toggle */}
              <div className="journey-builder__preview-toggle">
                <button
                  className={`journey-builder__preview-toggle-btn ${previewMode === 'blocks' ? 'journey-builder__preview-toggle-btn--active' : ''}`}
                  onClick={() => setPreviewMode('blocks')}
                  title="Block view"
                >
                  <Icon name="view_agenda" size={14} />
                </button>
                <button
                  className={`journey-builder__preview-toggle-btn ${previewMode === 'live' ? 'journey-builder__preview-toggle-btn--active' : ''}`}
                  onClick={() => setPreviewMode('live')}
                  title="Live view"
                >
                  <Icon name="web" size={14} />
                </button>
              </div>
              {previewMode === 'live' && (
                <button
                  className="journey-builder__preview-refresh"
                  onClick={() => {
                    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  title="Refresh preview"
                >
                  <Icon name="refresh" size={16} />
                </button>
              )}
              <a
                href={getPreviewUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="journey-builder__preview-expand"
                title="Open in new tab"
              >
                <Icon name="open_in_new" size={16} />
              </a>
            </div>
          </div>
          <div className="journey-builder__preview-info">
            <span className="journey-builder__preview-badge" style={{ background: currentLayout.isShopper ? '#58BD7D' : '#3B82F6' }}>
              {currentLayout.isShopper ? 'Shopper' : 'Browser'}
            </span>
            <span className="journey-builder__preview-experience">
              Experience {currentLayout.experience}
            </span>
            <span className="journey-builder__preview-sections">
              {sections.filter(s => s.enabled).length} sections
            </span>
          </div>
          
          {/* Live Preview (iframe) */}
          {previewMode === 'live' && (
            <div className="journey-builder__preview-iframe-container">
              <iframe
                id="preview-iframe"
                key={`${activeLayout}-${sections.length}-${hasChanges}`}
                src={getPreviewUrl()}
                className="journey-builder__preview-iframe"
                title="Page Preview"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          )}
          
          {/* Blocks Preview */}
          {previewMode === 'blocks' && (
            <div className="journey-builder__preview-frame">
              <div className="journey-builder__preview-content">
                {sections.filter(s => s.enabled).map((section, index) => {
                  const component = componentDefinitions[section.componentId];
                  return (
                    <div
                      key={index}
                      className={`journey-builder__preview-item journey-builder__preview-item--${component?.type || 'full-width'}`}
                    >
                      <span className="journey-builder__preview-item-name">{component?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="journey-builder__preview-legend">
            <div className="journey-builder__preview-legend-item">
              <span className="journey-builder__preview-legend-color journey-builder__preview-legend-color--full"></span>
              Full Width
            </div>
            <div className="journey-builder__preview-legend-item">
              <span className="journey-builder__preview-legend-color journey-builder__preview-legend-color--two-col"></span>
              Two Column
            </div>
          </div>
          </aside>

          {/* Version History Panel */}
          {showVersions && (
            <aside className="journey-builder__versions-panel">
              <VersionHistoryPanel
                versions={versions}
                isLoading={isLoadingVersions}
                onRestore={handleRestoreVersion}
                isRestoring={isRestoring}
              />
            </aside>
          )}
        </div>
      </DndContext>

      {/* Props Editor Modal */}
      {editingIndex !== null && sections[editingIndex] && (
        <PropsEditor
          section={sections[editingIndex]}
          onSave={(props) => handleUpdateProps(editingIndex, props)}
          onClose={() => setEditingIndex(null)}
        />
      )}

      {/* Component Preview Modal */}
      {previewComponent && (
        <ComponentPreviewModal
          component={previewComponent}
          onClose={() => setPreviewComponent(null)}
          onAdd={handleAddComponent}
        />
      )}
    </div>
  );
};

export default JourneyBuilder;
