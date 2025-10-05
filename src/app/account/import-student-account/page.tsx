import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function ImportStudentAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white/60 border-r border-slate-100 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">A</div>
          <div className="text-sm font-semibold">ATTENDEASE</div>
        </div>

        <nav className="space-y-2 text-slate-600 text-sm">
          <div className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">Dashboard</div>
          <div className="px-3 py-2 rounded-lg hover:bg-slate-100">Manage Users</div>
          <div className="px-3 py-2 rounded-lg hover:bg-slate-100">Manage Events</div>
          <div className="mt-6 border-t pt-4 text-xs text-slate-400">OTHERS</div>
          <div className="px-3 py-2 rounded-lg hover:bg-slate-100">Settings</div>
          <div className="px-3 py-2 rounded-lg hover:bg-slate-100">Accounts</div>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Import Student Accounts</h1>
          <p className="text-sm text-slate-500 mb-6">
            Upload important students details via CSV or Excel
          </p>
          <p className="text-sm text-slate-500 mb-6">
            <strong>Instructions:</strong> CSV must contain Student Number, Name, and Email.
          </p>

          <Card>
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 flex flex-col items-center justify-center text-slate-500">
                <Upload className="w-10 h-10 mb-4 text-slate-400" />
                <p className="text-sm">
                  Drag and drop files or <span className="text-blue-600">browse</span>
                </p>
                <p className="text-xs text-slate-400 mt-2">CSV or Excel</p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Cancel</Button>
                <Button>Upload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}