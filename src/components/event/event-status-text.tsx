import { EventStatus } from "@/interface/event/event-interface"
import { cn } from "@/lib/utils"

interface EventStatusTextProps {
     status: EventStatus
     className?: string
}

export function EventStatusText({ status, className }: EventStatusTextProps) {
     return (
          <span
               className={cn(
                    "inline-block text-sm",
                    {
                         "text-green-700": status === EventStatus.ONGOING,
                         "text-yellow-600": status === EventStatus.REGISTRATION,
                         "text-blue-700": status === EventStatus.UPCOMING,
                         "text-red-700": status === EventStatus.CANCELLED,
                         "": status === EventStatus.CONCLUDED || status === EventStatus.FINALIZED,
                    },
                    className
               )}
          >
               {status}
          </span>
     )
}
