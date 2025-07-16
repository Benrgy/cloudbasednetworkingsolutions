import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, X, Calculator, Network, DollarSign, Zap, CheckCircle } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  action?: string;
}

const OnboardingWalkthrough: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Cloud Based Networking Solutions Calculator',
      description: 'Your comprehensive tool for subnet calculations, IP allocation planning, and cloud cost estimation. Let us show you around!',
      icon: <Calculator className="h-6 w-6" />,
    },
    {
      id: 'subnet-calculator',
      title: 'Subnet Calculator',
      description: 'Calculate network addresses, broadcast addresses, and host capacity with precision. Perfect for VLSM and CIDR planning.',
      icon: <Network className="h-6 w-6" />,
      target: '#calculator',
      action: 'Navigate to Subnetting tab'
    },
    {
      id: 'ip-allocation',
      title: 'IP Allocation Planning',
      description: 'Optimize IP address distribution across your cloud infrastructure with intelligent planning tools.',
      icon: <Zap className="h-6 w-6" />,
      target: '#calculator',
      action: 'Switch to IP Allocation tab'
    },
    {
      id: 'cost-estimation',
      title: 'Multi-Cloud Cost Estimation',
      description: 'Compare networking costs across AWS, Azure, and Google Cloud Platform with real-time pricing data.',
      icon: <DollarSign className="h-6 w-6" />,
      target: '#calculator',
      action: 'Try Cost Estimation'
    },
    {
      id: 'get-started',
      title: 'Ready to Get Started?',
      description: 'You\'re all set! Start by entering your network parameters in any of our calculators. Need help? Check out our comprehensive FAQ section.',
      icon: <CheckCircle className="h-6 w-6" />,
    }
  ];

  useEffect(() => {
    const hasSeenKey = 'networking-calculator-onboarding-seen';
    const seen = localStorage.getItem(hasSeenKey);
    
    if (!seen) {
      // Show onboarding after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
    
    setHasSeenOnboarding(true);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('networking-calculator-onboarding-seen', 'true');
    setIsOpen(false);
    setHasSeenOnboarding(true);
  };

  const handleComplete = () => {
    localStorage.setItem('networking-calculator-onboarding-seen', 'true');
    setIsOpen(false);
    setHasSeenOnboarding(true);
    
    // Navigate to calculator if on final step
    if (currentStep === steps.length - 1) {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAction = () => {
    const step = steps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      {/* Trigger button for users who want to replay onboarding */}
      {hasSeenOnboarding && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentStep(0);
            setIsOpen(true);
          }}
          className="fixed bottom-4 left-4 z-50 shadow-lg"
        >
          <Calculator className="h-4 w-4 mr-2" />
          Tutorial
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  {currentStepData.icon}
                </div>
                <div>
                  <DialogTitle className="text-xl">{currentStepData.title}</DialogTitle>
                  <Badge variant="secondary" className="mt-1">
                    Step {currentStep + 1} of {steps.length}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <DialogDescription className="text-base leading-relaxed">
              {currentStepData.description}
            </DialogDescription>

            {/* Progress indicator */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Action button for steps with actions */}
            {currentStepData.action && currentStepData.target && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Try it now</h4>
                      <p className="text-sm text-muted-foreground">{currentStepData.action}</p>
                    </div>
                    <Button onClick={handleAction} size="sm">
                      Try Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Tutorial
                </Button>
                
                {isLastStep ? (
                  <Button onClick={handleComplete} className="flex items-center gap-2">
                    Get Started
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OnboardingWalkthrough;