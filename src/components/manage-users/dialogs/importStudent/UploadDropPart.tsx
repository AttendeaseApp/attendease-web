"use client"

import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface UploadDropPartProps {
     onFileSelect: (file: File) => void
}

export default function UploadDropPart({ onFileSelect }: UploadDropPartProps) {
     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
               onFileSelect(e.target.files[0])
          }
     }

     return (
          <div className="w-full rounded-md border border-dashed border-input py-10 px-6 text-center">
               <Upload className="mx-auto h-10 w-10 text-muted-foreground" />

               <div className="mt-4 flex justify-center items-center gap-1 text-sm text-muted-foreground">
                    <p>Drag and drop files or</p>
                    <Label
                         htmlFor="file-upload"
                         className="cursor-pointer font-medium text-blue-400 hover:underline hover:underline-offset-4"
                    >
                         browse
                         <input
                              id="file-upload"
                              type="file"
                              accept=".csv"
                              className="sr-only"
                              onChange={handleFileChange}
                         />
                    </Label>
               </div>
          </div>
     )
}
