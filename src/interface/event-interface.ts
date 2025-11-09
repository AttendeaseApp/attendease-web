export enum EventStatus {
  UPCOMING = "UPCOMING",
  REGISTRATION = "REGISTRATION",
  ONGOING = "ONGOING",
  CONCLUDED = "CONCLUDED",
  CANCELLED = "CANCELLED",
  FINALIZED = "FINALIZED",
}

export interface EligibilityCriteria {
  [key: string]: string | undefined
}

export interface EventLocation {
  id?: string
  name?: string
  [key: string]: string | undefined
}

export interface EventSession {
  eventId: string
  eventName: string
  eventLocation?: EventLocation | null
  eventLocationId?: string | null
  description?: string | null
  eligibleStudents?: EligibilityCriteria | null
  timeInRegistrationStartDateTime: string
  startDateTime: string
  endDateTime: string
  eventStatus: EventStatus
  createdByUserId?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}
