import { Button } from "@/components/ui/button"

export default function MoreSettingsPage() {
  return (
    <div className="min-h-screen bg-white p-6">
      <header className="border-b border-gray-200 mb-6 pb-3">
        <h1 className="text-2xl font-semibold">More settings</h1>
        <p className="text-sm text-gray-500">
          Account deactivation, and deletion. Facial Data deletion.
        </p>
      </header>

      <main>
        <Button
          variant="outline"
          className=" w-full flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 mt-1 py-4 px-6 h-auto"
        >
          <span className="text-sm font-semibold leading-none">
            Permanently DELETE all accounts (OSA and STUDENT).
          </span>
          <span className="text-xs text-black leading-tight">
            This action cannot be undone. This will permanently delete all accounts and remove all
            data from our database.
          </span>
        </Button>

        <Button
          variant="outline"
          className=" w-full flex flex-col items-start justify-center gap-1 rounded-md bg-white text-red-500 mt-1 py-4 px-6 h-auto"
        >
          <span className="text-sm font-semibold leading-none">
            Permanently DELETE all facial data ALL STUDENT.
          </span>
          <span className="text-xs text-black leading-tight">
            This action cannot be undone. This will permanently delete all facial data from our
            database. Students will be required to registered their facial data again.
          </span>
        </Button>

        <Button
          variant="outline"
          className=" w-full flex flex-col items-start justify-center gap-1 rounded-md bg-white text-black mt-1 py-4 px-6 h-auto"
        >
          <span className="text-sm font-semibold leading-none">
            Deactivate all accounts (OSA and STUDENT).
          </span>
          <span className="text-xs text-black leading-tight">
            Sets all account to INACTIVE. All accounts are still saved but inactive.
          </span>
        </Button>
      </main>
    </div>
  )
}
