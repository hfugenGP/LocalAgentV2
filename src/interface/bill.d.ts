export interface Bill {
    uuid?: string
    reference_id: string
    description: string
    project_code: string
    status: string
    due_at: string
    block: string
    currency?: string
    amount_cents: number
    billing_date: string
    type: string
    outstanding_amount_cents?: number
    reminder_days: number
    floor: string
    unit: string
    residence_uuid: string
    late_payment_charge?: number
}