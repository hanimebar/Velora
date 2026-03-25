export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type ImportedFrom = 'manual' | 'mindbody_csv'
export type BillingInterval = 'month' | 'year'
export type MembershipStatus = 'active' | 'paused' | 'cancelled' | 'past_due'
export type PackStatus = 'active' | 'exhausted' | 'expired'
export type BookingStatus = 'confirmed' | 'cancelled' | 'waitlisted' | 'attended' | 'no_show'
export type ChargedFrom = 'membership' | 'pack'

export interface Database {
  public: {
    Tables: {
      studios: {
        Row: {
          id: string
          created_at: string
          owner_id: string
          name: string
          slug: string
          timezone: string
          stripe_customer_id: string | null
          currency: string
          logo_url: string | null
          description: string | null
          contact_email: string | null
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['studios']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['studios']['Insert']>
      }
      class_types: {
        Row: {
          id: string
          created_at: string
          studio_id: string
          name: string
          description: string | null
          duration_minutes: number
          color: string
        }
        Insert: Omit<Database['public']['Tables']['class_types']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['class_types']['Insert']>
      }
      class_sessions: {
        Row: {
          id: string
          created_at: string
          studio_id: string
          class_type_id: string
          instructor_name: string
          starts_at: string
          ends_at: string
          capacity: number
          is_cancelled: boolean
          cancellation_note: string | null
          recurrence_rule: string | null
        }
        Insert: Omit<Database['public']['Tables']['class_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['class_sessions']['Insert']>
      }
      clients: {
        Row: {
          id: string
          created_at: string
          studio_id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          stripe_customer_id: string | null
          imported_from: ImportedFrom
          source_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      memberships: {
        Row: {
          id: string
          created_at: string
          studio_id: string
          name: string
          description: string | null
          price_per_period: number
          currency: string
          billing_interval: BillingInterval
          stripe_price_id: string | null
          stripe_product_id: string | null
          is_active: boolean
          classes_per_period: number | null
        }
        Insert: Omit<Database['public']['Tables']['memberships']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['memberships']['Insert']>
      }
      class_packs: {
        Row: {
          id: string
          created_at: string
          studio_id: string
          name: string
          class_count: number
          price: number
          currency: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          validity_days: number
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['class_packs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['class_packs']['Insert']>
      }
      client_memberships: {
        Row: {
          id: string
          created_at: string
          client_id: string
          studio_id: string
          membership_id: string
          stripe_subscription_id: string
          status: MembershipStatus
          current_period_start: string | null
          current_period_end: string | null
          cancelled_at: string | null
          classes_used_this_period: number
        }
        Insert: Omit<Database['public']['Tables']['client_memberships']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['client_memberships']['Insert']>
      }
      client_packs: {
        Row: {
          id: string
          created_at: string
          client_id: string
          studio_id: string
          class_pack_id: string
          stripe_payment_intent_id: string | null
          classes_total: number
          classes_used: number
          purchased_at: string
          expires_at: string
          status: PackStatus
        }
        Insert: Omit<Database['public']['Tables']['client_packs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['client_packs']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          session_id: string
          client_id: string
          studio_id: string
          status: BookingStatus
          booked_at: string
          cancelled_at: string | null
          cancellation_token: string
          charged_from: ChargedFrom | null
          client_pack_id: string | null
          client_membership_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
    }
  }
}

// Convenience row types
export type Studio = Database['public']['Tables']['studios']['Row']
export type ClassType = Database['public']['Tables']['class_types']['Row']
export type ClassSession = Database['public']['Tables']['class_sessions']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Membership = Database['public']['Tables']['memberships']['Row']
export type ClassPack = Database['public']['Tables']['class_packs']['Row']
export type ClientMembership = Database['public']['Tables']['client_memberships']['Row']
export type ClientPack = Database['public']['Tables']['client_packs']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
