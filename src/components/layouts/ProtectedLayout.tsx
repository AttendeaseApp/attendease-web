import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar"

/**
 * ProtectedLayout component that ensures only authenticated users can access its children.
 *
 * @param param0 as { children: React.ReactNode }
 * @returns JSX.Element The ProtectedLayout component.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
     const router = useRouter()

     useEffect(() => {
          const token = localStorage.getItem("authToken")
          if (!token) {
               router.push("/login")
          }
     }, [router])

     return (
          <SidebarProvider>
               <div className="flex min-h-screen bg-background w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col min-w-0 w-full">
                         <main className="flex-1 w-full">
                              <div className="p-4 md:p-6 lg:p-8 h-full w-full">{children}</div>
                         </main>
                    </div>
               </div>
          </SidebarProvider>
     )
}
