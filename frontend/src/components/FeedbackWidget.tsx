import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, CheckCircle2 } from "lucide-react";

interface FeedbackWidgetProps {
    grievanceId: string;
    onSubmit?: (rating: number, comment: string) => void;
}

export function FeedbackWidget({ grievanceId, onSubmit }: FeedbackWidgetProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit?.(rating, comment);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Card className="border-success/30 bg-success-light/20">
                <CardContent className="py-6 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                    <p className="font-semibold">Thank you for your feedback!</p>
                    <p className="text-sm text-muted-foreground">
                        Your rating of {rating}/5 stars helps us improve our services.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

    return (
        <Card className="shadow-soft">
            <CardContent className="py-6 space-y-4">
                <div className="text-center space-y-1">
                    <p className="font-semibold">Rate Your Experience</p>
                    <p className="text-sm text-muted-foreground">How was the resolution of case {grievanceId}?</p>
                </div>

                {/* Star Rating */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-125"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground/30"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {(hoverRating || rating) > 0 && (
                        <p className="text-sm font-medium text-primary">
                            {ratingLabels[hoverRating || rating]}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <Textarea
                    placeholder="Share your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[80px] resize-none"
                />

                {/* Submit */}
                <Button
                    variant="hero"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={rating === 0}
                >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                </Button>
            </CardContent>
        </Card>
    );
}
