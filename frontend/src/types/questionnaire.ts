export type YesNoPrefer = 'yes' | 'no' | 'prefer-not-to-say'
export type TransportMode = 'walking' | 'vehicle' | 'public-transport' | 'unknown'

export type SensitiveAnswer = {
  value: string
  preferNotToSay: boolean
}

export type MissingPersonQuestionnaire = {
  personName: string
  age: string
  height: string
  physicalCharacteristics: string
  distinguishingMarks: string
  lastContactDate: string
  lastContactTime: string
  state: string
  city: string
  neighborhood: string
  lastKnownAddress: string
  clothing: string
  circumstances: string
  likelyTransport: TransportMode | ''
  healthConditions: SensitiveAnswer
  continuousMedication: SensitiveAnswer
  mobilityDifficulty: SensitiveAnswer
  memoryOrDisorientation: SensitiveAnswer
  disappearanceHistory: SensitiveAnswer
  otherRelevantInformation: SensitiveAnswer
  informantName: string
  relationship: string
  contactPhone: string
  hasPoliceReport: YesNoPrefer | ''
  policeReportNumber: string
  responsibilityConfirmed: boolean
  legalGuardianConsent: boolean
}

export type InMemoryPhoto = {
  id: string
  file: File
  previewUrl: string
}

export const initialQuestionnaire: MissingPersonQuestionnaire = {
  personName: '',
  age: '',
  height: '',
  physicalCharacteristics: '',
  distinguishingMarks: '',
  lastContactDate: '',
  lastContactTime: '',
  state: '',
  city: '',
  neighborhood: '',
  lastKnownAddress: '',
  clothing: '',
  circumstances: '',
  likelyTransport: '',
  healthConditions: { value: '', preferNotToSay: false },
  continuousMedication: { value: '', preferNotToSay: false },
  mobilityDifficulty: { value: '', preferNotToSay: false },
  memoryOrDisorientation: { value: '', preferNotToSay: false },
  disappearanceHistory: { value: '', preferNotToSay: false },
  otherRelevantInformation: { value: '', preferNotToSay: false },
  informantName: '',
  relationship: '',
  contactPhone: '',
  hasPoliceReport: '',
  policeReportNumber: '',
  responsibilityConfirmed: false,
  legalGuardianConsent: false,
}

export const questionnaireSteps = [
  'Identificação',
  'Circunstâncias',
  'Informações privadas',
  'Responsável',
  'Fotografias',
  'Revisão',
] as const
