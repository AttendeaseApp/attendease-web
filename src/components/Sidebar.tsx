import {
     Calendar,
     Users,
     User,
     LocationEditIcon,
     TicketCheck,
     Library,
     GraduationCap,
} from "lucide-react"
import {
     Sidebar,
     SidebarContent,
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu,
     SidebarMenuButton,
     SidebarMenuItem,
     SidebarHeader,
     SidebarTrigger,
     useSidebar,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import Link from "next/link"

const menu = [
     {
          title: "Monitor Events",
          url: "/monitor-events",
          icon: TicketCheck,
     },
     {
          title: "Attendance Records",
          url: "/manage-attendance",
          icon: Library,
     },
     {
          title: "Events",
          url: "/manage-events",
          icon: Calendar,
     },
     {
          title: "Locations",
          url: "/manage-locations",
          icon: LocationEditIcon,
     },
     {
          title: "Users",
          url: "/manage-users",
          icon: Users,
     },
     {
          title: "Academic Management",
          url: "/academic-management",
          icon: GraduationCap,
     },
]

const others = [
     {
          title: "My Profile",
          url: "/account",
          icon: User,
     },
]

export function AppSidebar() {
     const { open, setOpen, setOpenMobile, isMobile } = useSidebar()
     const pathname = usePathname()
     useEffect(() => {
          localStorage.setItem("sidebar-open", String(open))
     }, [open])
     useEffect(() => {
          if (isMobile) {
               setOpenMobile(false)
          }
     }, [pathname, isMobile, setOpenMobile])

     return (
          <Sidebar collapsible="icon">
               <SidebarHeader>
                    <div>
                         <SidebarTrigger />
                    </div>
               </SidebarHeader>
               <SidebarContent>
                    <SidebarGroup>
                         <SidebarGroupLabel>Menu</SidebarGroupLabel>
                         <SidebarGroupContent>
                              <SidebarMenu>
                                   {menu.map((menuItem) => (
                                        <SidebarMenuItem key={menuItem.title}>
                                             <SidebarMenuButton asChild>
                                                  <Link href={menuItem.url}>
                                                       <menuItem.icon />
                                                       <span>{menuItem.title}</span>
                                                  </Link>
                                             </SidebarMenuButton>
                                        </SidebarMenuItem>
                                   ))}
                              </SidebarMenu>
                         </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                         <SidebarGroupLabel>Others</SidebarGroupLabel>
                         <SidebarGroupContent>
                              <SidebarMenu>
                                   {others.map((otherItem) => (
                                        <SidebarMenuItem key={otherItem.title}>
                                             <SidebarMenuButton asChild>
                                                  <Link href={otherItem.url}>
                                                       <otherItem.icon />
                                                       <span>{otherItem.title}</span>
                                                  </Link>
                                             </SidebarMenuButton>
                                        </SidebarMenuItem>
                                   ))}
                              </SidebarMenu>
                         </SidebarGroupContent>
                    </SidebarGroup>
               </SidebarContent>
          </Sidebar>
     )
}
