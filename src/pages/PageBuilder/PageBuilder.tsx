/**
 * Page Builder Dashboard
 * Visual drag-and-drop interface for managing home page layouts
 * Supports 8 experience versions based on user vehicle data and shopping intent
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from '../../components/Icon';
import homePageLayouts from '../../config/homePageLayouts.json';
import './PageBuilder.css';

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
  props: Record<string, ComponentProp>;
}

interface SectionConfig {
  componentId: string;
  props: Record<string, string | number | boolean>;
  enabled: boolean;
}

interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  experience: string;
  isShopper: boolean;
  sections: SectionConfig[];
}

type LayoutKey = 'A-shopper' | 'A-browser' | 'B-shopper' | 'B-browser' | 'C-shopper' | 'C-browser' | 'D-shopper' | 'D-browser';

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
      className={`page-builder__canvas-item ${!section.enabled ? 'page-builder__canvas-item--disabled' : ''} ${isSelected ? 'page-builder__canvas-item--selected' : ''}`}
      onClick={() => onSelect(index)}
    >
      <div className="page-builder__canvas-item-drag" {...attributes} {...listeners}>
        <Icon name="drag_indicator" size={20} />
      </div>
      <div className="page-builder__canvas-item-content">
        <div className="page-builder__canvas-item-header">
          <span className="page-builder__canvas-item-index">{index + 1}</span>
          <span className="page-builder__canvas-item-name">{component?.name || section.componentId}</span>
          <span className={`page-builder__canvas-item-type page-builder__canvas-item-type--${component?.type || 'full-width'}`}>
            {component?.type === 'two-column' ? '2-col' : 'full'}
          </span>
        </div>
        <p className="page-builder__canvas-item-description">{component?.description}</p>
      </div>
      <div className="page-builder__canvas-item-actions">
        <button
          className="page-builder__canvas-item-btn"
          onClick={(e) => { e.stopPropagation(); onEditProps(index); }}
          title="Edit Props"
        >
          <Icon name="settings" size={16} />
        </button>
        <button
          className={`page-builder__canvas-item-btn ${section.enabled ? '' : 'page-builder__canvas-item-btn--inactive'}`}
          onClick={(e) => { e.stopPropagation(); onToggle(index); }}
          title={section.enabled ? 'Disable' : 'Enable'}
        >
          <Icon name={section.enabled ? 'visibility' : 'visibility_off'} size={16} />
        </button>
        <button
          className="page-builder__canvas-item-btn page-builder__canvas-item-btn--danger"
          onClick={(e) => { e.stopPropagation(); onRemove(index); }}
          title="Remove"
        >
          <Icon name="delete" size={16} />
        </button>
      </div>
    </div>
  );
};

// Draggable Palette Item
const PaletteItem: React.FC<{
  component: ComponentDefinition;
  onAdd: (componentId: string) => void;
}> = ({ component, onAdd }) => {
  return (
    <div
      className="page-builder__palette-item"
      onClick={() => onAdd(component.id)}
      draggable
    >
      <div className="page-builder__palette-item-icon">
        <Icon name="widgets" size={20} />
      </div>
      <div className="page-builder__palette-item-content">
        <span className="page-builder__palette-item-name">{component.name}</span>
        <span className={`page-builder__palette-item-type page-builder__palette-item-type--${component.type}`}>
          {component.type === 'two-column' ? '2-col' : 'full'}
        </span>
      </div>
      <button className="page-builder__palette-item-add">
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
    <div className="page-builder__modal-overlay" onClick={onClose}>
      <div className="page-builder__modal" onClick={e => e.stopPropagation()}>
        <div className="page-builder__modal-header">
          <h3>Edit {component?.name} Props</h3>
          <button className="page-builder__modal-close" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="page-builder__modal-content">
          {component && Object.entries(component.props).map(([key, propDef]) => (
            <div key={key} className="page-builder__prop-field">
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
                <label className="page-builder__checkbox">
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
            <p className="page-builder__no-props">This component has no configurable props.</p>
          )}
        </div>
        <div className="page-builder__modal-footer">
          <button className="page-builder__btn page-builder__btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="page-builder__btn page-builder__btn--primary" onClick={() => { onSave(editedProps); onClose(); }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Experience Tab
const ExperienceTab: React.FC<{
  layoutKey: LayoutKey;
  layout: LayoutConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ layoutKey, layout, isActive, onClick }) => {
  const experienceLabels: Record<string, string> = {
    'A': 'Want ✓ Own ✓',
    'B': 'Want ✓ Own ✗',
    'C': 'Want ✗ Own ✓',
    'D': 'Want ✗ Own ✗',
  };

  return (
    <button
      className={`page-builder__tab ${isActive ? 'page-builder__tab--active' : ''}`}
      onClick={onClick}
    >
      <div className="page-builder__tab-experience">
        <span className="page-builder__tab-letter">{layout.experience}</span>
        <span className={`page-builder__tab-shopper ${layout.isShopper ? 'page-builder__tab-shopper--yes' : ''}`}>
          {layout.isShopper ? 'Shopper' : 'Browser'}
        </span>
      </div>
      <div className="page-builder__tab-info">
        <span className="page-builder__tab-vehicles">{experienceLabels[layout.experience]}</span>
      </div>
    </button>
  );
};

// Main Page Builder Component
export const PageBuilder: React.FC = () => {
  const [activeLayout, setActiveLayout] = useState<LayoutKey>('D-browser');
  const [layouts, setLayouts] = useState<Record<LayoutKey, LayoutConfig>>(
    homePageLayouts.layouts as Record<LayoutKey, LayoutConfig>
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentLayout = layouts[activeLayout];
  const sections = currentLayout?.sections || [];

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

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
      // In a real app, this would be an API call
      // For now, we'll save to localStorage and show instructions
      const updatedConfig = {
        ...homePageLayouts,
        layouts,
        lastUpdated: new Date().toISOString(),
      };
      
      localStorage.setItem('homePageLayouts', JSON.stringify(updatedConfig));
      
      // Also log the JSON for manual update
      console.log('Updated homePageLayouts.json:', JSON.stringify(updatedConfig, null, 2));
      
      setSaveStatus('saved');
      setHasChanges(false);
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      setSaveStatus('error');
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('homePageLayouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.layouts) {
          setLayouts(parsed.layouts as Record<LayoutKey, LayoutConfig>);
        }
      } catch (e) {
        console.error('Error loading saved layouts:', e);
      }
    }
  }, []);

  // Preview URL
  const getPreviewUrl = () => {
    const params = new URLSearchParams({
      experience: currentLayout.experience,
      isShopper: String(currentLayout.isShopper),
      preview: 'true',
    });
    return `/?${params.toString()}`;
  };

  return (
    <div className="page-builder">
      {/* Header */}
      <header className="page-builder__header">
        <div className="page-builder__header-left">
          <h1 className="page-builder__title">
            <Icon name="dashboard_customize" size={28} />
            Page Builder
          </h1>
          <span className="page-builder__subtitle">
            Manage home page layouts for different user experiences
          </span>
        </div>
        <div className="page-builder__header-actions">
          {hasChanges && (
            <span className="page-builder__unsaved">Unsaved changes</span>
          )}
          <a
            href={getPreviewUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="page-builder__btn page-builder__btn--secondary"
          >
            <Icon name="open_in_new" size={16} />
            Preview
          </a>
          <button
            className={`page-builder__btn page-builder__btn--primary ${saveStatus === 'saving' ? 'page-builder__btn--loading' : ''}`}
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Experience Tabs */}
      <div className="page-builder__tabs">
        {(Object.entries(layouts) as [LayoutKey, LayoutConfig][]).map(([key, layout]) => (
          <ExperienceTab
            key={key}
            layoutKey={key}
            layout={layout}
            isActive={activeLayout === key}
            onClick={() => setActiveLayout(key)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="page-builder__content">
        {/* Component Palette */}
        <aside className="page-builder__palette">
          <h2 className="page-builder__palette-title">
            <Icon name="widgets" size={20} />
            Components
          </h2>
          <p className="page-builder__palette-hint">Click to add to canvas</p>
          <div className="page-builder__palette-list">
            {Object.values(componentDefinitions).map(component => (
              <PaletteItem
                key={component.id}
                component={component}
                onAdd={handleAddComponent}
              />
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="page-builder__canvas">
          <div className="page-builder__canvas-header">
            <h2 className="page-builder__canvas-title">
              {currentLayout.name}
            </h2>
            <p className="page-builder__canvas-description">
              {currentLayout.description}
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((_, i) => `section-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="page-builder__canvas-list">
                {sections.length === 0 ? (
                  <div className="page-builder__canvas-empty">
                    <Icon name="add_circle_outline" size={48} />
                    <p>No components yet</p>
                    <span>Click a component from the palette to add it</span>
                  </div>
                ) : (
                  sections.map((section, index) => (
                    <SortableItem
                      key={`section-${index}`}
                      id={`section-${index}`}
                      section={section}
                      index={index}
                      onToggle={handleToggle}
                      onRemove={handleRemove}
                      onEditProps={setEditingIndex}
                      isSelected={selectedIndex === index}
                      onSelect={setSelectedIndex}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId && sections[parseInt(activeId.replace('section-', ''))] && (
                <div className="page-builder__canvas-item page-builder__canvas-item--dragging">
                  <div className="page-builder__canvas-item-drag">
                    <Icon name="drag_indicator" size={20} />
                  </div>
                  <div className="page-builder__canvas-item-content">
                    <span className="page-builder__canvas-item-name">
                      {componentDefinitions[sections[parseInt(activeId.replace('section-', ''))].componentId]?.name}
                    </span>
                  </div>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </main>

        {/* Preview Panel */}
        <aside className="page-builder__preview">
          <h2 className="page-builder__preview-title">
            <Icon name="preview" size={20} />
            Preview
          </h2>
          <div className="page-builder__preview-frame">
            <div className="page-builder__preview-content">
              {sections.filter(s => s.enabled).map((section, index) => {
                const component = componentDefinitions[section.componentId];
                return (
                  <div
                    key={index}
                    className={`page-builder__preview-item page-builder__preview-item--${component?.type || 'full-width'}`}
                  >
                    <span className="page-builder__preview-item-name">{component?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="page-builder__preview-legend">
            <div className="page-builder__preview-legend-item">
              <span className="page-builder__preview-legend-color page-builder__preview-legend-color--full"></span>
              Full Width
            </div>
            <div className="page-builder__preview-legend-item">
              <span className="page-builder__preview-legend-color page-builder__preview-legend-color--two-col"></span>
              Two Column
            </div>
          </div>
        </aside>
      </div>

      {/* Props Editor Modal */}
      {editingIndex !== null && sections[editingIndex] && (
        <PropsEditor
          section={sections[editingIndex]}
          onSave={(props) => handleUpdateProps(editingIndex, props)}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
};

export default PageBuilder;

