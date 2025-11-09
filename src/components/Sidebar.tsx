import { Calendar, Home, Users, User, Settings } from "lucide-react"
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
 
// Menu items.
const menu = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Manage User",
    url: "#", //to be followed
    icon: Users,
  },
  {
    title: "Manage Event",
    url: "#", //to be followed
    icon: Calendar,
  }
]

const others = [
  {
    title: "Settings",
    url: "#", //to be followed
    icon: Settings,
  },
  {
    title: "Accounts",
    url: "#", //to be followed
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