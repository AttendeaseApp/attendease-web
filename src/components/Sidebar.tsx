import {
     Calendar,
     Home,
     Users,
     User,
     Settings,
     LocationEditIcon,
     TicketCheck,
     Library,
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
} from "@/components/ui/sidebar"

const menu = [
     // {
     //      title: "Dashboard",
     //      url: "/dashboard",
     //      icon: Home,
     // },
     {
          title: "Monitor Events",
          url: "/monitor-events",
          icon: TicketCheck,
     },
     {
          title: "Manage Attendance Records",
          url: "/manage-attendance",
          icon: Library,
     },
     {
          title: "Manage Users",
          url: "/manage-users",
          icon: Users,
     },
     {
          title: "Manage Events",
          url: "/manage-events",
          icon: Calendar,
     },
     {
          title: "Manage Venues",
          url: "/manage-locations",
          icon: LocationEditIcon,
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
     return (
          <Sidebar>
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
