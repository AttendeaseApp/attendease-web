import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImportStudentAccountPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="w-64" />

      <main className="flex-1 p-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Import Student Accounts
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Upload a CSV file to import student accounts.
          </p>

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
