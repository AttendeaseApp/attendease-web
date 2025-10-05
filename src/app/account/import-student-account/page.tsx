import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImportStudentAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white/60 border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            A
          </div>
          <div className="text-sm font-semibold">ATTENDEASE</div>
        </div>

        <nav className="space-y-2 text-slate-600 text-sm">
          <a href="/" className="block px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700">Dashboard</a>
          <a href="/account/create-osa-account" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Manage Users</a>
          <a href="/account/create-student-account" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Manage Students</a>
          <a href="/account/import-student-account" className="block px-3 py-2 rounded-lg hover:bg-slate-100">Import Students</a>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">Import Student Accounts</h1>
          <p className="text-sm text-slate-500 mb-6">Upload a CSV file to import student accounts.</p>

          <Card>
            <CardContent className="p-8 space-y-6">
              <div>
                <Label>Upload CSV File</Label>
                <Input type="file" accept=".csv" />
              </div>

              <div className="flex justify-end">
                <Button className="bg-black text-white">Import</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
