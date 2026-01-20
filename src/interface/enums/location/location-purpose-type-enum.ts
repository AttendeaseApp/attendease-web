export enum LocationPurposeType {
     EVENT_VENUE = "EVENT_VENUE",
     REGISTRATION_AREA = "REGISTRATION_AREA",
}

export const LocationPurposeLabel: Record<LocationPurposeType, string> = {
     [LocationPurposeType.EVENT_VENUE]: "Event Venue",
     [LocationPurposeType.REGISTRATION_AREA]: "Registration Area",
}
