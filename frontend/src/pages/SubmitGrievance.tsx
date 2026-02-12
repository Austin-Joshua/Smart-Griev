import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useGrievance } from "@/contexts/GrievanceContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FileText, Upload, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GrievanceCategory, GrievanceUrgency } from "@/types";

export default function SubmitGrievance() {
    const { submitGrievance, isLoading } = useGrievance();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [category, setCategory] = useState<GrievanceCategory | "">("");
    const [urgency, setUrgency] = useState<GrievanceUrgency | "">("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!category || !urgency || !description) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("category", category);
            formData.append("urgency", urgency);
            formData.append("description", description);
            if (location) formData.append("location", location);
            if (file) formData.append("file", file);

            await submitGrievance(formData);

            toast({
                title: "Grievance Submitted",
                description: "Your grievance has been successfully logged. You can track its status in the dashboard."
            });
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Submission error:", err);
            setError(err.response?.data?.detail || "Failed to submit grievance. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container py-8 flex items-center justify-center">
                <Card className="w-full max-w-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary" />
                            Submit a Grievance
                        </CardTitle>
                        <CardDescription>
                            Provide details about your issue. Our AI will analyze and route it to the correct department.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                                    <Select value={category} onValueChange={(v) => setCategory(v as GrievanceCategory)}>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Civic">Civic Infrastructure</SelectItem>
                                            <SelectItem value="Utilities">Utilities (Water/Power)</SelectItem>
                                            <SelectItem value="Safety">Public Safety</SelectItem>
                                            <SelectItem value="Environment">Environment & Sanitation</SelectItem>
                                            <SelectItem value="Transport">Transport & Traffic</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="urgency">Urgency <span className="text-destructive">*</span></Label>
                                    <Select value={urgency} onValueChange={(v) => setUrgency(v as GrievanceUrgency)}>
                                        <SelectTrigger id="urgency">
                                            <SelectValue placeholder="Select Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low - Routine issue</SelectItem>
                                            <SelectItem value="Medium">Medium - Standard priority</SelectItem>
                                            <SelectItem value="High">High - Urgent attention needed</SelectItem>
                                            <SelectItem value="Critical">Critical - Immediate hazard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        placeholder="E.g., 2nd Cross, Indiranagar"
                                        className="pl-9"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the issue in detail..."
                                    className="min-h-[120px]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">Attachment (Optional)</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    {file ? (
                                        <p className="text-sm font-medium text-primary">{file.name}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                            <p className="text-xs text-muted-foreground">Images or documents up to 5MB</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="button" variant="outline" className="mr-4" onClick={() => navigate("/dashboard")}>Cancel</Button>
                                <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Grievance"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
}
