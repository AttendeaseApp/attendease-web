"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { AcademicYear } from "@/services/api/academic/academic-year"
import { triggerAcademicYearActivation } from "@/services/api/academic/academic-year"
import { toast } from "sonner"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

interface AcademicYearCardProps {
     academicYear: AcademicYear
}

export const AcademicYearCard = ({ academicYear }: AcademicYearCardProps) => {
     const [isTriggering, setIsTriggering] = useState(false)
     const canTrigger = ["UPCOMING", "IN_PROGRESS"].includes(academicYear.status)

     const statusVariant = () => {
          switch (academicYear.status) {
               case "IN_PROGRESS":
                    return "default"
               case "UPCOMING":
                    return "outline"
               case "COMPLETED":
                    return "secondary"
               case "BETWEEN_SEMESTERS":
                    return "outline"
               default:
                    return "default"
          }
     }

     const handleTriggerActivation = async () => {
          if (!canTrigger) return
          setIsTriggering(true)
          try {
               const response = await triggerAcademicYearActivation()
               toast.success("Success", {
                    description: response.message,
               })
          } catch (error: any) {
               toast.error("Error", {
                    description: error.message || "Failed to trigger activation.",
               })
          } finally {
               setIsTriggering(false)
          }
     }

     const semesterInfo = academicYear.currentSemester ? (
          <p className="text-sm text-center sm:text-left">
               {academicYear.currentSemester.name} (
               {format(new Date(academicYear.currentSemester.startDate), "MMM d, yyyy")} –{" "}
               {format(new Date(academicYear.currentSemester.endDate), "MMM d, yyyy")})
          </p>
     ) : (
          <p className="text-sm text-muted-foreground text-center">No semester currently active.</p>
     )

     return (
          <TooltipProvider>
               <div className="p-4 border rounded-lg shadow-sm bg-background">
                    <div className="flex items-center justify-between gap-4">
                         <div className="flex items-center gap-3 min-w-0 flex-1">
                              <h2 className="text-lg font-semibold truncate">
                                   {academicYear.academicYearName}
                              </h2>
                              <Badge variant={statusVariant()} className="shrink-0">
                                   {academicYear.status?.replace(/_/g, " ") || "Unknown"}
                              </Badge>
                              {academicYear.currentSemester && (
                                   <span className="hidden md:inline text-sm text-muted-foreground truncate">
                                        {academicYear.currentSemester.name}
                                   </span>
                              )}
                              {academicYear.progressPercentage != null && (
                                   <span className="hidden lg:inline text-sm text-muted-foreground shrink-0">
                                        {academicYear.progressPercentage}% completed
                                   </span>
                              )}
                         </div>
                         <div className="flex items-center gap-2 shrink-0">
                              {canTrigger && (
                                   <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={handleTriggerActivation}
                                                  disabled={isTriggering}
                                                  className="hidden sm:flex items-center gap-2"
                                             >
                                                  {isTriggering ? "Running..." : "Run Scheduler"}
                                                  <HelpCircle className="h-3 w-3" />
                                             </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="max-w-xs">
                                             <p className="text-sm">
                                                  <strong>Manual Trigger Explanation:</strong> This
                                                  button runs the academic year activation scheduler
                                                  immediately, without waiting for the nightly cron
                                                  job.
                                                  <br />
                                                  <br />
                                                  <strong>Use Cases:</strong>
                                                  <ul className="list-disc list-inside mt-1 text-xs">
                                                       <li>
                                                            Automatic activation of upcoming
                                                            academic years when they start
                                                       </li>
                                                       <li>
                                                            Automatic deactivation of academic years
                                                            when they end
                                                       </li>
                                                       <li>
                                                            Automatic semester transitions within
                                                            active academic years
                                                       </li>
                                                       <li>
                                                            Use this also if you want to
                                                            automatically activate created sections
                                                            within current semester
                                                       </li>
                                                  </ul>
                                             </p>
                                        </TooltipContent>
                                   </Tooltip>
                              )}
                         </div>
                    </div>
               </div>
          </TooltipProvider>
     )
}
