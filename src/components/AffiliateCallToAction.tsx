import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Phone, MessageCircle, Clock, Star, Award, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AffiliateCallToActionProps {
  results?: any;
  calculationType?: 'subnet' | 'allocation' | 'cost';
}

const AffiliateCallToAction: React.FC<AffiliateCallToActionProps> = ({ 
  results, 
  calculationType = 'subnet' 
}) => {
  const { toast } = useToast();
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    company: '',
    projectScope: '',
    timeline: '',
    budget: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partners = [
    {
      name: "Amazon Web Services",
      speciality: "Enterprise Cloud Infrastructure",
      rating: 4.9,
      projects: "1M+",
      description: "Best for complex subnetting and enterprise-scale networking with advanced VPC features",
      ctaText: "Start Free Tier",
      url: "https://aws.amazon.com/free/?trk=affiliate",
      badge: "Best for Enterprise",
      strengths: "Global reach, advanced networking, enterprise features"
    },
    {
      name: "Google Cloud Platform",
      speciality: "AI & Analytics",
      rating: 4.8,
      projects: "500K+",
      description: "Perfect for IP allocation and data-driven workloads with cutting-edge networking",
      ctaText: "Try $300 Credit",
      url: "https://cloud.google.com/free?utm_source=affiliate",
      badge: "Best for Innovation",
      strengths: "AI/ML capabilities, open-source friendly, container networking"
    },
    {
      name: "Microsoft Azure",
      speciality: "Hybrid Cloud Solutions",
      rating: 4.7,
      projects: "800K+",
      description: "Ideal for cost optimization and hybrid environments with deep Microsoft integration",
      ctaText: "Get $200 Credit",
      url: "https://azure.microsoft.com/free/?ref=affiliate",
      badge: "Best for Hybrid",
      strengths: "Microsoft integration, hybrid cloud, enterprise compliance"
    }
  ];

  const getContextualMessage = () => {
    if (!results && !calculationType) {
      return "Ready to implement your network design? Choose the best cloud platform for your specific needs.";
    }

    switch (calculationType) {
      case 'subnet':
        return results 
          ? `Perfect! Your ${results.networkAddress || 'network'} configuration is ready. Based on your requirements, here's the best cloud platform match:`
          : "Subnet planning complete? Based on your network size and complexity, here are our recommendations:";
      
      case 'allocation':
        return "IP allocation optimized! For your specific IP management needs, these platforms offer the best features:";
      
      case 'cost':
        return results 
          ? "Based on your cost analysis, here are cloud platforms that offer the best value for your specific requirements:"
          : "Cost estimates ready? Get the most value with these cloud providers:";
      
      default:
        return "Transform your network calculations into reality with our recommended cloud partners.";
    }
  };

  const getRecommendedProvider = () => {
    if (!results && !calculationType) return partners[0]; // Default to AWS

    switch (calculationType) {
      case 'subnet':
        // For complex subnetting, recommend AWS for its advanced VPC features
        return partners.find(p => p.name === 'Amazon Web Services') || partners[0];
      
      case 'allocation':
        // For IP allocation, recommend Google Cloud for its networking features
        return partners.find(p => p.name === 'Google Cloud Platform') || partners[1];
      
      case 'cost':
        // For cost optimization, recommend based on results or default to Azure
        return partners.find(p => p.name === 'Microsoft Azure') || partners[2];
      
      default:
        return partners[0];
    }
  };

  const handlePartnerClick = (partner: typeof partners[0]) => {
    // Track affiliate click
    console.log(`Affiliate click: ${partner.name}`);
    
    // Open affiliate link in new tab
    window.open(partner.url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: `Opening ${partner.name}`,
      description: `Get started with ${partner.ctaText.toLowerCase()} and implement your network design!`,
    });
  };

  const handleQuickCall = () => {
    // Simulate click-to-call functionality
    toast({
      title: "Setting up your call",
      description: "Our partner will call you within 5 minutes",
    });
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Consultation request submitted! 🎉",
        description: "A network expert will contact you within 24 hours",
      });
      
      setIsConsultationDialogOpen(false);
      setConsultationForm({
        name: '',
        email: '',
        company: '',
        projectScope: '',
        timeline: '',
        budget: '',
        requirements: ''
      });
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Contextual CTA Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">{getContextualMessage()}</h3>
            <p className="text-muted-foreground">
              Connect with our certified network partners for professional implementation and optimization services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handleQuickCall}
                className="flex items-center gap-2"
                size="lg"
              >
                <Phone className="h-5 w-5" />
                Get Instant Call
                <Badge variant="secondary" className="ml-2">
                  <Clock className="h-3 w-3 mr-1" />
                  5 min
                </Badge>
              </Button>
              
              <Dialog open={isConsultationDialogOpen} onOpenChange={setIsConsultationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Request Consultation
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request Professional Consultation</DialogTitle>
                    <DialogDescription>
                      Tell us about your networking project and we'll connect you with the right expert
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleConsultationSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={consultationForm.name}
                          onChange={(e) => setConsultationForm({...consultationForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={consultationForm.email}
                          onChange={(e) => setConsultationForm({...consultationForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={consultationForm.company}
                          onChange={(e) => setConsultationForm({...consultationForm, company: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-scope">Project Scope</Label>
                        <Select
                          value={consultationForm.projectScope}
                          onValueChange={(value) => setConsultationForm({...consultationForm, projectScope: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select scope" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-implementation">New Implementation</SelectItem>
                            <SelectItem value="migration">Cloud Migration</SelectItem>
                            <SelectItem value="optimization">Cost Optimization</SelectItem>
                            <SelectItem value="security-audit">Security Audit</SelectItem>
                            <SelectItem value="automation">Network Automation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Timeline</Label>
                        <Select
                          value={consultationForm.timeline}
                          onValueChange={(value) => setConsultationForm({...consultationForm, timeline: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate (1-2 weeks)</SelectItem>
                            <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                            <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                            <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select
                          value={consultationForm.budget}
                          onValueChange={(value) => setConsultationForm({...consultationForm, budget: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-10k">Under $10K</SelectItem>
                            <SelectItem value="10k-50k">$10K - $50K</SelectItem>
                            <SelectItem value="50k-100k">$50K - $100K</SelectItem>
                            <SelectItem value="100k-plus">$100K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements & Goals</Label>
                      <Textarea
                        id="requirements"
                        value={consultationForm.requirements}
                        onChange={(e) => setConsultationForm({...consultationForm, requirements: e.target.value})}
                        placeholder="Describe your networking requirements, current challenges, and project goals..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsConsultationDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Request Consultation"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partners.map((partner, index) => (
          <Card key={index} className="hover:shadow-medium transition-smooth group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {partner.name}
                    {partner.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {partner.badge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {partner.speciality}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{partner.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{partner.projects} projects</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{partner.description}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Verified Partner</span>
              </div>
              
              <Button 
                onClick={() => handlePartnerClick(partner)}
                className="w-full group-hover:bg-primary/90 transition-colors"
              >
                {partner.ctaText}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trust indicators */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certified network engineering partners</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Transparent pricing, no hidden fees</span>
            </div>
            <div className="text-xs">
              <strong>Affiliate Disclosure:</strong> We may earn commissions from partner referrals
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateCallToAction;