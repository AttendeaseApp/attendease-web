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
import { useEffect } from "react"

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
     const { setOpenMobile, isMobile } = useSidebar()
     const pathname = usePathname()
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
                                                  <a href={menuItem.url}>
                                                       <menuItem.icon />
                                                       <span>{menuItem.title}</span>
                                                  </a>
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
                                                  <a href={otherItem.url}>
                                                       <otherItem.icon />
                                                       <span>{otherItem.title}</span>
                                                  </a>
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
