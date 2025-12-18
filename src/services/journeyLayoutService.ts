/**
 * Journey Layout Service
 * 
 * Data access layer for Journey Builder layouts.
 * Uses Supabase when configured, falls back to localStorage otherwise.
 */

import { supabase, canUseSupabase } from '../lib/supabase';
import type { JourneyLayout, LayoutVersion, SectionConfig } from '../lib/supabase';
import homePageLayouts from '../config/homePageLayouts.json';

// Type assertion helper for untyped tables
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// Types
export type LayoutKey = 'A-shopper' | 'A-browser' | 'B-shopper' | 'B-browser' | 'C-shopper' | 'C-browser' | 'D-shopper' | 'D-browser';

export interface LayoutConfig {
  id: string;
  name: string;
  description: string;
  experience: string;
  isShopper: boolean;
  sections: SectionConfig[];
}

export interface VersionInfo {
  id: string;
  versionNumber: number;
  createdAt: string;
  changedBy: string | null;
  changeDescription: string | null;
}

// Local storage key
const LOCAL_STORAGE_KEY = 'homePageLayouts';

/**
 * Get all layouts from Supabase or localStorage
 */
export async function getLayouts(): Promise<Record<LayoutKey, LayoutConfig>> {
  console.log('[journeyLayoutService] getLayouts called:', { 
    canUseSupabase: canUseSupabase(), 
    hasDb: !!db 
  });

  // Always get localStorage data first (this is where saves go when Supabase RLS blocks)
  const localStorageLayouts = getLayoutsFromLocalStorage();
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:getLayouts',message:'localStorage layouts loaded',data:{layoutKeys:Object.keys(localStorageLayouts),sampleSections:localStorageLayouts['D-browser']?.sections?.map((s:{componentId:string})=>s.componentId)||[]},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H7-READ'})}).catch(()=>{});
  // #endregion

  if (canUseSupabase() && db) {
    try {
      console.log('[journeyLayoutService] Fetching from Supabase...');
      const { data, error } = await db
        .from('journey_layouts')
        .select('*')
        .order('layout_key');

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('[journeyLayoutService] Loaded from Supabase:', { count: data.length });
        const supabaseLayouts: Record<string, LayoutConfig> = {};
        data.forEach((layout: JourneyLayout) => {
          supabaseLayouts[layout.layout_key as LayoutKey] = {
            id: layout.layout_key,
            name: layout.name,
            description: layout.description,
            experience: layout.experience,
            isShopper: layout.is_shopper,
            sections: layout.sections || [],
          };
        });
        
        // Merge: Use localStorage sections if they exist (more recent), otherwise use Supabase
        const mergedLayouts: Record<string, LayoutConfig> = {};
        for (const key of Object.keys(supabaseLayouts)) {
          const localLayout = localStorageLayouts[key as LayoutKey];
          const supabaseLayout = supabaseLayouts[key];
          
          // If localStorage has sections for this layout, use those (they're more recent due to RLS blocking Supabase writes)
          const useLocalSections = localLayout?.sections && localLayout.sections.length > 0;
          
          mergedLayouts[key] = {
            ...supabaseLayout,
            sections: useLocalSections ? localLayout.sections : supabaseLayout.sections,
          };
        }
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:getLayouts:merged',message:'Merged Supabase + localStorage',data:{mergedSections:mergedLayouts['D-browser']?.sections?.map((s:{componentId:string})=>s.componentId)||[]},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H7-READ'})}).catch(()=>{});
        // #endregion
        
        return mergedLayouts as Record<LayoutKey, LayoutConfig>;
      }
    } catch (error) {
      console.error('Error fetching layouts from Supabase:', error);
    }
  }

  // Fallback to localStorage
  console.log('[journeyLayoutService] Falling back to localStorage');
  return localStorageLayouts;
}

/**
 * Get layouts from localStorage (fallback)
 */
function getLayoutsFromLocalStorage(): Record<LayoutKey, LayoutConfig> {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.layouts) {
        console.log('[journeyLayoutService] Loaded from localStorage:', { 
          lastUpdated: parsed.lastUpdated,
          layoutKeys: Object.keys(parsed.layouts)
        });
        return parsed.layouts as Record<LayoutKey, LayoutConfig>;
      }
    }
    console.log('[journeyLayoutService] No saved layouts in localStorage, using defaults');
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }

  // Return default from JSON config
  return homePageLayouts.layouts as Record<LayoutKey, LayoutConfig>;
}

/**
 * Update a single layout
 */
export async function updateLayout(
  layoutKey: LayoutKey,
  sections: SectionConfig[],
  _changeDescription?: string
): Promise<{ success: boolean; error?: string }> {
  console.log('[journeyLayoutService] updateLayout called:', { 
    layoutKey, 
    sectionsCount: sections.length,
    sectionOrder: sections.map(s => s.componentId),
    canUseSupabase: canUseSupabase(),
    hasDb: !!db
  });

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:updateLayout',message:'updateLayout service called',data:{layoutKey,sectionsCount:sections.length,sectionOrder:sections.map(s=>s.componentId),canUseSupabase:canUseSupabase(),hasDb:!!db},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3'})}).catch(()=>{});
  // #endregion

  if (canUseSupabase() && db) {
    try {
      console.log('[journeyLayoutService] Saving to Supabase...');
      // Get current user
      const { data: { user } } = await supabase!.auth.getUser();

      // Get layout metadata from config for upsert
      const layoutConfig = (homePageLayouts.layouts as Record<string, LayoutConfig>)[layoutKey];
      
      // Use UPSERT to handle case where row doesn't exist yet
      const { data, error } = await db
        .from('journey_layouts')
        .upsert({
          layout_key: layoutKey,
          name: layoutConfig?.name || layoutKey,
          description: layoutConfig?.description || '',
          experience: layoutConfig?.experience || layoutKey.charAt(0),
          is_shopper: layoutConfig?.isShopper || layoutKey.includes('shopper'),
          sections,
          updated_by: user?.id || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'layout_key',
        })
        .select();

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:updateLayout:afterSupabase',message:'Supabase upsert result',data:{error:error?.message||null,rowsUpserted:data?.length||0,layoutKey,upsertedSections:data?.[0]?.sections?.map((s:{componentId:string})=>s.componentId)||null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H3-FIX'})}).catch(()=>{});
      // #endregion

      if (error) throw error;

      console.log('[journeyLayoutService] Saved to Supabase successfully');
      return { success: true };
    } catch (error) {
      console.error('Error updating layout in Supabase, falling back to localStorage:', error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:updateLayout:catch',message:'Supabase upsert error - falling back to localStorage',data:{error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6-FALLBACK'})}).catch(()=>{});
      // #endregion
      // Fall back to localStorage instead of failing
      return updateLayoutInLocalStorage(layoutKey, sections);
    }
  }

  // Fallback to localStorage
  console.log('[journeyLayoutService] Using localStorage fallback');
  return updateLayoutInLocalStorage(layoutKey, sections);
}

/**
 * Update layout in localStorage (fallback)
 */
function updateLayoutInLocalStorage(
  layoutKey: LayoutKey,
  sections: SectionConfig[]
): { success: boolean; error?: string } {
  try {
    console.log('[journeyLayoutService] Saving to localStorage:', { layoutKey, sectionsCount: sections.length });
    
    const layouts = getLayoutsFromLocalStorage();
    layouts[layoutKey] = {
      ...layouts[layoutKey],
      sections,
    };

    const updatedConfig = {
      ...homePageLayouts,
      layouts,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConfig));
    
    // Verify save
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const verified = saved ? JSON.parse(saved) : null;
    console.log('[journeyLayoutService] Save verified:', { 
      layoutKey, 
      savedSectionsCount: verified?.layouts?.[layoutKey]?.sections?.length 
    });
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:updateLayoutInLocalStorage',message:'localStorage save successful',data:{layoutKey,sectionsCount:sections.length,sectionOrder:sections.map(s=>s.componentId),verifiedCount:verified?.layouts?.[layoutKey]?.sections?.length||0},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6-FALLBACK'})}).catch(()=>{});
    // #endregion
    
    return { success: true };
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/ea2cb3d8-73ff-4cad-8c8d-a241debed5cc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'journeyLayoutService.ts:updateLayoutInLocalStorage:error',message:'localStorage save failed',data:{layoutKey,error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H6-FALLBACK'})}).catch(()=>{});
    // #endregion
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get version history for a layout
 */
export async function getVersionHistory(layoutKey: LayoutKey): Promise<VersionInfo[]> {
  if (!canUseSupabase() || !supabase) {
    // No version history in localStorage mode
    return [];
  }

  try {
    // First get the layout ID
    const { data: layout, error: layoutError } = await db
      .from('journey_layouts')
      .select('id')
      .eq('layout_key', layoutKey)
      .single();

    if (layoutError || !layout) {
      console.error('Error finding layout:', layoutError);
      return [];
    }

    // Then get versions
    const { data: versions, error: versionsError } = await db
      .from('layout_versions')
      .select('*')
      .eq('layout_id', layout.id)
      .order('version_number', { ascending: false })
      .limit(20);

    if (versionsError) {
      console.error('Error fetching versions:', versionsError);
      return [];
    }

    return (versions || []).map((v: LayoutVersion) => ({
      id: v.id,
      versionNumber: v.version_number,
      createdAt: v.created_at,
      changedBy: v.changed_by,
      changeDescription: v.change_description,
    }));
  } catch (error) {
    console.error('Error fetching version history:', error);
    return [];
  }
}

/**
 * Restore a layout to a previous version
 */
export async function restoreVersion(
  layoutKey: LayoutKey,
  versionId: string
): Promise<{ success: boolean; sections?: SectionConfig[]; error?: string }> {
  if (!canUseSupabase() || !db) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Get the version data
    const { data: version, error: versionError } = await db
      .from('layout_versions')
      .select('sections')
      .eq('id', versionId)
      .single();

    if (versionError || !version) {
      throw new Error('Version not found');
    }

    // Update the layout with the old sections
    const result = await updateLayout(
      layoutKey,
      version.sections,
      `Restored to previous version`
    );

    if (result.success) {
      return { success: true, sections: version.sections };
    }

    return result;
  } catch (error) {
    console.error('Error restoring version:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Seed initial data from JSON config to Supabase
 */
export async function seedInitialData(): Promise<{ success: boolean; error?: string }> {
  if (!canUseSupabase() || !db) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    const defaultLayouts = homePageLayouts.layouts as Record<LayoutKey, LayoutConfig>;

    for (const [layoutKey, layout] of Object.entries(defaultLayouts)) {
      const { error } = await db
        .from('journey_layouts')
        .update({
          sections: layout.sections,
          updated_at: new Date().toISOString(),
        })
        .eq('layout_key', layoutKey);

      if (error) {
        console.error(`Error seeding ${layoutKey}:`, error);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Check if Supabase is available and connected
 */
export async function checkConnection(): Promise<boolean> {
  if (!canUseSupabase() || !db) {
    return false;
  }

  try {
    const { error } = await db
      .from('journey_layouts')
      .select('id')
      .limit(1);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Subscribe to real-time layout changes
 */
export function subscribeToLayoutChanges(
  callback: (layoutKey: LayoutKey, sections: SectionConfig[]) => void
): (() => void) | null {
  if (!canUseSupabase() || !supabase) {
    return null;
  }

  const subscription = supabase
    .channel('journey_layouts_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'journey_layouts',
      },
      (payload) => {
        const { layout_key, sections } = payload.new as JourneyLayout;
        callback(layout_key as LayoutKey, sections);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    if (supabase) {
      supabase.removeChannel(subscription);
    }
  };
}

