export interface importCSVDetail {
     row: number
     errors: string[]
}

export interface importCSVSummary {
     totalRows: number
     successfulRows: number
     failedRows: number
     missingSections: string[]
     duplicateStudentNumbers: string[]
     errorTypes: Record<string, number>
}

export interface importCSVResult {
     errorCode?: string
     message?: string
     summary: importCSVSummary
     details: importCSVDetail[]
     timestamp?: string
}
