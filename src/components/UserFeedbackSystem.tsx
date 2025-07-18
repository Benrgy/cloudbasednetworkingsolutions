import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ThumbsUp, 
  ThumbsDown,
  Bug,
  Lightbulb,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "./AnalyticsTracker";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackData {
  type: 'bug' | 'feature' | 'improvement' | 'general';
  rating: number;
  category: string;
  subject: string;
  description: string;
  email?: string;
  timestamp: string;
  page: string;
  userAgent: string;
}

const UserFeedbackSystem = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Partial<FeedbackData>>({
    type: 'general',
    rating: 5,
    category: 'calculator',
    subject: '',
    description: '',
    email: ''
  });

  const feedbackTypes = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'destructive' },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'primary' },
    { value: 'improvement', label: 'Improvement', icon: Target, color: 'warning' },
    { value: 'general', label: 'General Feedback', icon: MessageSquare, color: 'secondary' }
  ];

  const categories = [
    'Calculator Functionality',
    'User Interface',
    'Performance',
    'Documentation',
    'Cost Estimates',
    'Network Security',
    'Multi-Cloud Features',
    'Professional Tools',
    'Mobile Experience',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.subject || !feedbackData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide both a subject and description for your feedback.",
        variant: "destructive",
      });
      return;
    }

    const feedback: FeedbackData = {
      ...feedbackData,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      userAgent: navigator.userAgent
    } as FeedbackData;

    try {
      // Store feedback locally for backup
      const existingFeedback = localStorage.getItem('user_feedback') || '[]';
      const feedbackList = JSON.parse(existingFeedback);
      feedbackList.push(feedback);
      localStorage.setItem('user_feedback', JSON.stringify(feedbackList));
      
      // Send feedback via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-feedback', {
        body: feedback
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log('💬 Feedback sent successfully:', data);

      // Track feedback submission in analytics
      analytics.track('feedback_submitted', {
        category: 'feedback',
        action: 'submit',
        label: feedback.type,
        value: feedback.rating
      });

      setSubmitted(true);
      toast({
        title: "Feedback Sent Successfully!",
        description: feedback.email 
          ? "Your feedback has been sent and you'll receive a confirmation email shortly."
          : "Your feedback has been sent to our team. Thank you for helping us improve!",
      });

      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setFeedbackData({
          type: 'general',
          rating: 5,
          category: 'calculator',
          subject: '',
          description: '',
          email: ''
        });
      }, 3000);

    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Email Sending Failed",
        description: "Could not send email, but feedback was saved locally. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
            className="transition-colors"
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star 
              className={`h-5 w-5 ${
                star <= (feedbackData.rating || 0) 
                  ? 'fill-primary text-primary' 
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 shadow-lg"
          size="icon"
          aria-label="Open feedback form"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-strong border-primary/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Professional Feedback
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback form"
            >
              ×
            </Button>
          </div>
          <CardDescription>
            Help us improve this networking calculator for professionals
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 text-success mx-auto" />
              <div>
                <h3 className="font-semibold text-success">Thank You!</h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback has been submitted and will help improve our professional tools.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFeedbackData(prev => ({ ...prev, type: type.value as any }))}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        feedbackData.type === type.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'
                      }`}
                      aria-label={`Select ${type.label} feedback type`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-3">
                  {renderStars()}
                  <span className="text-sm text-muted-foreground">
                    {feedbackData.rating}/5
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={feedbackData.category} 
                  onValueChange={(value) => setFeedbackData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(' ', '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={feedbackData.subject}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your feedback"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Details</Label>
                <Textarea
                  id="description"
                  value={feedbackData.description}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed feedback, steps to reproduce issues, or feature suggestions..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="For follow-up on your feedback"
                />
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserFeedbackSystem;