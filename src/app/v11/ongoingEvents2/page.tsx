import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"


export default function OngoingAttendanceMonitoringV2() {

  
    const EventName ={
    eventName:"Celestial Night"
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
     <div className="w-full max-w-6xl mx-auto mb-4 flex items-center justify-between">
  {/*Event History Label */}
    <label className="text-sm font-medium">
  <span className="text-[#71717A]">Student Logs{" "}-</span>{" "}
  <span className="text-black">{EventName.eventName}</span>
</label>
  

  {/* more settings Button */}
  <div className="flex space-x-2">
     <Button className="rounded-sm">Export</Button>
    <Button variant="outline" className="rounded-sm">
      More Settings <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </div>
</div>

  {/* Row 2 */}
<div className="w-full max-w-6xl mx-auto mb-4 flex items-center justify-between flex-wrap mt-8">
  {/* search bar */}
  <div className="flex items-center space-x-2">
    <Input
      className="w-64 border border-gray-200"
      placeholder="Search..."
    />
  </div>

  {/* filter buttons */}
  <div className="flex items-center space-x-2 mt-2 sm:mt-0">
   
    <Button variant="outline" className="rounded-sm">
      GRADE LEVEL <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
    <Button variant="outline" className="rounded-sm">
      SECTION <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
    <Button variant="outline" className="rounded-sm">
      COURSE <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
     <Button variant="outline" className="rounded-sm">
      ATTENDANCE  <ChevronDown className="ml-2 h-4 w-4" />
    </Button>
  </div>
</div>


      {/* Table */}
      <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-md border bg-white shadow mt-7">
        <Table>
         <TableHeader>
  <TableRow className="h-16">
    <TableHead className="w-1/7 py-4 px-6">FULL NAME</TableHead>       
    <TableHead className="w-1/12 py-4 px-6">CLUSTER</TableHead>
    <TableHead className="w-1/12 py-4 px-6">COURSE</TableHead>
    <TableHead className="w-1/12 py-4 px-6">GRADE LEVEL</TableHead>
    <TableHead className="w-1/12 py-4 px-6">Attendance Log</TableHead>

  </TableRow>
</TableHeader>

          <TableBody>
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-gray-500"
              >
                No data yet.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      {/* next back button*/}
      <div className="w-full max-w-6xl mx-auto flex justify-end items-center space-x-2 mt-8">
    <Button variant="outline" className="rounded-sm">
      Previous
    </Button>
    <Button variant="outline" className="rounded-sm">
      Next
    </Button>
  
  </div>
    </div>
  )
}
