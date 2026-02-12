export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: string
          created_at: string
        }
        Insert: {
          id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          role?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          slug: string
          title: string
          city: string
          state: string
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          style_tags: string[]
          budget_range: string | null
          goal: string | null
          summary: string | null
          what_we_did: string | null
          design_notes: string | null
          timeline_weeks: number | null
          cover_image_path: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          city: string
          state?: string
          property_type: string
          bedrooms?: number | null
          bathrooms?: number | null
          style_tags?: string[]
          budget_range?: string | null
          goal?: string | null
          summary?: string | null
          what_we_did?: string | null
          design_notes?: string | null
          timeline_weeks?: number | null
          cover_image_path?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          city?: string
          state?: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          style_tags?: string[]
          budget_range?: string | null
          goal?: string | null
          summary?: string | null
          what_we_did?: string | null
          design_notes?: string | null
          timeline_weeks?: number | null
          cover_image_path?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_images: {
        Row: {
          id: string
          project_id: string
          path: string
          caption: string | null
          space: string | null
          sort_order: number
          is_before: boolean
          is_after: boolean
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          path: string
          caption?: string | null
          space?: string | null
          sort_order?: number
          is_before?: boolean
          is_after?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          path?: string
          caption?: string | null
          space?: string | null
          sort_order?: number
          is_before?: boolean
          is_after?: boolean
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          city: string | null
          property_type: string | null
          bedrooms: number | null
          bathrooms: number | null
          current_status: string | null
          target_guests: string[]
          style_preferences: string[]
          timeline: string | null
          budget_furnishing_range: string | null
          budget_service_range: string | null
          scope: string[]
          links: string[]
          notes: string | null
          internal_status: string
          internal_notes: string | null
          created_at: string
          archived: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          city?: string | null
          property_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          current_status?: string | null
          target_guests?: string[]
          style_preferences?: string[]
          timeline?: string | null
          budget_furnishing_range?: string | null
          budget_service_range?: string | null
          scope?: string[]
          links?: string[]
          notes?: string | null
          internal_status?: string
          internal_notes?: string | null
          created_at?: string
          archived?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          city?: string | null
          property_type?: string | null
          bedrooms?: number | null
          bathrooms?: number | null
          current_status?: string | null
          target_guests?: string[]
          style_preferences?: string[]
          timeline?: string | null
          budget_furnishing_range?: string | null
          budget_service_range?: string | null
          scope?: string[]
          links?: string[]
          notes?: string | null
          internal_status?: string
          internal_notes?: string | null
          created_at?: string
          archived?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectInsert = Database['public']['Tables']['projects']['Insert']
export type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export type ProjectImage = Database['public']['Tables']['project_images']['Row']
export type ProjectImageInsert = Database['public']['Tables']['project_images']['Insert']
export type ProjectImageUpdate = Database['public']['Tables']['project_images']['Update']

export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
