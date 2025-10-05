import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const header = () => {
  return (
    <header className="fixed top-0 left-70 right-10 bg-white px-6 py-4 items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-950">Dashboard</h1>
        <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 hover:bg-gray-200 rounded-full px-2 py-1">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </button>  
        </div>
    </header>
  )
}

export default header