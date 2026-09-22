import { useState } from "react";
import type { OfficialProfile } from "@/types/igot";
import {
  ROLE_PROFILES,
  getCompetenciesByCategory,
} from "@/data/roleCompetencyData";
import type { CompetencyCategory } from "@/types/skillFoundation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

interface Props {
  onSubmit: (info: OfficialProfile) => void;
  loading: boolean;
}

const CATEGORIES: CompetencyCategory[] = [
  "Statistical",
  "Technical",
  "Digital Governance",
  "Behavioural & Managerial",
];

const DESIGNATIONS = [
  "Statistical Officer",
  "Assistant Statistical Officer",
  "Statistical Investigator",
  "Data Analyst",
  "Research Officer",
  "IT / Systems Officer",
  "Deputy Director",
  "Other",
];

const DEPARTMENTS = [
  "Directorate of Economics & Statistics",
  "State Statistical Office",
  "Ministry / Central Government Department",
  "National Statistical Office",
  "Government Data / IT Department",
  "Other",
];

const EXPERIENCE_OPTIONS = [
  { label: "0–2 years", value: "1" },
  { label: "3–5 years", value: "4" },
  { label: "6–10 years", value: "8" },
  { label: "11–15 years", value: "13" },
  { label: "15+ years", value: "16" },
];

export default function UserInfoForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<OfficialProfile>({
    name: "",
    designation: "",
    department: "",
    role: "",
    experienceYears: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: keyof OfficialProfile, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const selectedRole = ROLE_PROFILES.find(role => role.name === form.role);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.designation.trim()) errs.designation = "Designation is required";
    if (!form.department.trim()) errs.department = "Department / organization is required";
    if (!form.role) errs.role = "Job role is required";
    if (!form.experienceYears) errs.experienceYears = "Years of experience is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="min-h-screen gradient-surface flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <BriefcaseBusiness className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Competency Profile</h1>
          <p className="text-muted-foreground mt-2">Build your role-based competency profile and assessment.</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-primary" />
              Professional Profile
            </CardTitle>
            <CardDescription>
              Select your role and experience band. The assessment will be generated from that role's competency requirements.
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
                  <Label>Designation</Label>
                  <Select value={form.designation} onValueChange={value => update("designation", value)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select designation" /></SelectTrigger>
                    <SelectContent>
                      {DESIGNATIONS.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.designation && <p className="text-sm text-destructive mt-1">{errors.designation}</p>}
                </div>
                <div>
                  <Label>Department / Organisation</Label>
                  <Select value={form.department} onValueChange={value => update("department", value)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select department / organisation" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive mt-1">{errors.department}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Job Role</Label>
                  <Select value={form.role} onValueChange={value => update("role", value)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select your job role" /></SelectTrigger>
                    <SelectContent>
                      {ROLE_PROFILES.map(role => <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Select
                    value={form.experienceYears ? String(form.experienceYears) : ""}
                    onValueChange={value => update("experienceYears", Number(value))}
                  >
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select experience band" /></SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_OPTIONS.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.experienceYears && <p className="text-sm text-destructive mt-1">{errors.experienceYears}</p>}
                </div>
              </div>

              {selectedRole && (
                <Card className="bg-muted/40 border-border">
                  <CardHeader className="pb-3">
                    <CardDescription>Selected Role</CardDescription>
                    <CardTitle className="text-xl">{selectedRole.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CATEGORIES.map(category => {
                      const count = getCompetenciesByCategory(category, selectedRole.id).length;
                      return (
                        <div key={category} className="rounded-lg border bg-card p-4">
                          <p className="text-sm font-medium text-muted-foreground">{category}</p>
                          <p className="text-2xl font-bold mt-1">{count}</p>
                          <p className="text-xs text-muted-foreground">competencies</p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Building Assessment...
                  </span>
                ) : "Start Competency Assessment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
