import { useState } from "react";
import type { OfficialProfile } from "@/types/igot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

interface Props {
  onSubmit: (info: OfficialProfile) => void;
  loading: boolean;
}

export default function UserInfoForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<OfficialProfile>({
    name: "", designation: "", department: "", role: "",
    currentAssignment: "", qualification: "", experienceYears: 0,
    previousTraining: "",
  });
  const [experience, setExperience] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof OfficialProfile, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.department.trim()) errs.department = "Department / organization is required";
    if (!form.role.trim()) errs.role = "Job role is required";
    if (!form.currentAssignment.trim()) errs.currentAssignment = "Current assignment is required";
    if (!form.qualification.trim()) errs.qualification = "Highest qualification is required";
    if (!experience || isNaN(Number(experience)) || Number(experience) < 0 || Number(experience) > 60) {
      errs.experienceYears = "Enter valid experience (0-60 years)";
    }
    if (!form.previousTraining.trim()) errs.previousTraining = "Please mention relevant previous training";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, experienceYears: Number(experience) });
  };

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <BriefcaseBusiness className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Competency Profile</h1>
          <p className="text-muted-foreground mt-2">AI-powered competency assessment for public-sector professionals</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-primary" />
              Professional Profile
            </CardTitle>
            <CardDescription>
              Your professional profile helps the AI identify the competencies relevant to your role and create a personalized assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={form.name} onChange={e => update("name", e.target.value)} placeholder="Enter full name" className="mt-1.5" />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input id="designation" value={form.designation} onChange={e => update("designation", e.target.value)} placeholder="e.g., Statistical Officer" className="mt-1.5" />
                  {errors.designation && <p className="text-sm text-destructive mt-1">{errors.designation}</p>}
                </div>
                <div>
                  <Label htmlFor="department">Department / Organization</Label>
                  <Input id="department" value={form.department} onChange={e => update("department", e.target.value)} placeholder="e.g., Directorate of Economics & Statistics" className="mt-1.5" />
                  {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Job Role</Label>
                  <Input id="role" value={form.role} onChange={e => update("role", e.target.value)} placeholder="e.g., Survey & Data Analyst" className="mt-1.5" />
                  {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input id="experience" type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g., 8" className="mt-1.5" min={0} max={60} />
                  {errors.experienceYears && <p className="text-sm text-destructive mt-1">{errors.experienceYears}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="assignment">Current Assignment</Label>
                <Input id="assignment" value={form.currentAssignment} onChange={e => update("currentAssignment", e.target.value)} placeholder="Describe your current responsibilities or assignment" className="mt-1.5" />
                {errors.currentAssignment && <p className="text-sm text-destructive mt-1">{errors.currentAssignment}</p>}
              </div>

              <div>
                <Label htmlFor="qualification">Highest Qualification</Label>
                <Input id="qualification" value={form.qualification} onChange={e => update("qualification", e.target.value)} placeholder="e.g., M.Sc. Statistics, M.Tech. Data Science" className="mt-1.5" />
                {errors.qualification && <p className="text-sm text-destructive mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <Label htmlFor="training">Previous Training</Label>
                <Input id="training" value={form.previousTraining} onChange={e => update("previousTraining", e.target.value)} placeholder="Relevant courses, workshops, certifications, or departmental training" className="mt-1.5" />
                {errors.previousTraining && <p className="text-sm text-destructive mt-1">{errors.previousTraining}</p>}
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Building Profile...
                  </span>
                ) : (
                  "Build My Competency Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}