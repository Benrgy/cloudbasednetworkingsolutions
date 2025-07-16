import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Gift, TrendingUp, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const interestOptions = [
    { id: 'subnet-calc', label: 'Subnet Calculation Tips', icon: <Zap className="h-4 w-4" /> },
    { id: 'cloud-costs', label: 'Cloud Cost Optimization', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'security', label: 'Network Security Best Practices', icon: <Shield className="h-4 w-4" /> },
    { id: 'automation', label: 'Network Automation Guides', icon: <Zap className="h-4 w-4" /> },
  ];

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setInterests([...interests, interestId]);
    } else {
      setInterests(interests.filter(id => id !== interestId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to subscribe",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with actual newsletter service integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store subscription locally for demo
      const subscription = {
        email,
        interests,
        subscribedAt: new Date().toISOString(),
      };
      
      localStorage.setItem('newsletter-subscription', JSON.stringify(subscription));
      
      toast({
        title: "Successfully subscribed! 🎉",
        description: "Welcome to our networking community. Check your inbox for a confirmation email.",
      });
      
      // Reset form
      setEmail('');
      setInterests([]);
      
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Unable to process your subscription. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Weekly cloud networking tips and tutorials",
    "Exclusive cost optimization strategies",
    "Early access to new calculator features",
    "Industry insights from networking experts",
    "Free network architecture templates"
  ];

  return (
    <Card className="bg-gradient-secondary border-0 shadow-medium">
      <CardHeader className="text-center">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Join Our Networking Community</CardTitle>
        <CardDescription className="text-lg">
          Get expert tips, exclusive tools, and stay ahead in cloud networking
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Benefits list */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            What you'll get:
          </h3>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <div className="bg-primary/20 rounded-full w-1.5 h-1.5 mt-2 flex-shrink-0"></div>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Subscription form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newsletter-email">Email Address</Label>
            <Input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
            />
          </div>

          {/* Interest selection */}
          <div className="space-y-3">
            <Label>What interests you most? (Optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interestOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={interests.includes(option.id)}
                    onCheckedChange={(checked) => 
                      handleInterestChange(option.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={option.id} 
                    className="text-sm flex items-center gap-2 cursor-pointer"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
            size="lg"
          >
            {isLoading ? "Subscribing..." : "Subscribe for Free"}
          </Button>
        </form>

        {/* Privacy notice */}
        <p className="text-xs text-muted-foreground text-center">
          We respect your privacy. Unsubscribe at any time. No spam, just valuable networking content.
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;