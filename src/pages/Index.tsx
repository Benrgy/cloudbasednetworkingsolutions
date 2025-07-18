
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Calculator, Network, Zap, ArrowRight, CheckCircle, TrendingUp, Shield } from "lucide-react";
import AdvancedNetworkCalculator from "@/components/AdvancedNetworkCalculator";
import FAQ from "@/components/FAQ";
import Navigation from "@/components/Navigation";
import { ProfessionalTooltip } from "@/components/ProfessionalTooltips";
import { useAnalytics } from "@/components/AnalyticsTracker";
import UserFeedbackSystem from "@/components/UserFeedbackSystem";

const Index = () => {
  const { trackUserEngagement } = useAnalytics();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      trackUserEngagement('navigation', `scroll_to_${sectionId}`);
    }
  };
  
  useEffect(() => {
    trackUserEngagement('page', 'view');
  }, [trackUserEngagement]);

  const features = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Subnet Calculator",
      description: "Calculate network addresses, broadcast addresses, and host capacity with precision",
      tooltip: "Advanced VLSM and CIDR calculations with real-time validation"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "IP Allocation Planning", 
      description: "Optimize IP address distribution across your cloud infrastructure", 
      tooltip: "Intelligent IP planning with utilization tracking and recommendations"
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Multi-Cloud Cost Estimation",
      description: "Compare networking costs across AWS, Azure, and Google Cloud Platform",
      tooltip: "Real-time pricing data with cost optimization recommendations"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Best Practices",
      description: "Built-in recommendations for secure cloud network design", 
      tooltip: "Automated security scoring and compliance recommendations"
    }
  ];

  const usageSteps = [
    {
      step: "1",
      title: "Select Your Tool",
      description: "Choose from subnet calculator, IP allocation, or cost estimation"
    },
    {
      step: "2", 
      title: "Input Parameters",
      description: "Enter your network requirements, IP ranges, and cloud preferences"
    },
    {
      step: "3",
      title: "Get Results", 
      description: "Receive detailed calculations, recommendations, and cost estimates"
    },
    {
      step: "4",
      title: "Optimize & Plan",
      description: "Use insights to optimize your cloud network architecture"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32 mt-16" role="banner">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                Cloud Based Networking
                <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Solutions Calculator
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Professional-grade tools for subnet calculation, IP allocation planning, and multi-cloud cost estimation. 
                Optimize your network architecture with precision and confidence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="hero" 
                size="xl" 
                className="group" 
                onClick={() => scrollToSection('calculator')}
                aria-label="Navigate to network calculator section"
              >
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="secondary" 
                size="xl" 
                onClick={() => scrollToSection('faq')}
                aria-label="Navigate to documentation and FAQ section"
              >
                View Documentation
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {features.map((feature, index) => (
                <ProfessionalTooltip key={index} content={feature.tooltip} type="info" side="bottom">
                  <div className="text-center group cursor-help">
                    <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 group-hover:bg-white/20 transition-smooth">
                      <div className="text-white flex items-center justify-center h-full">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </ProfessionalTooltip>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="bg-muted/30 py-[70px]" role="region" aria-labelledby="how-to-use-heading">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 id="how-to-use-heading" className="text-3xl md:text-4xl font-bold">How to Use Our Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with our cloud based networking tools in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {usageSteps.map((step, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
                {index < usageSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-primary">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20" role="region" aria-labelledby="calculator-heading">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 id="calculator-heading" className="text-3xl md:text-4xl font-bold">Network Calculator Tools</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools for subnet calculation, IP allocation, and cost estimation
            </p>
          </div>
          <AdvancedNetworkCalculator />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/30" role="region" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold">Why Choose Our Calculator</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools designed for network engineers and cloud architects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <CardTitle>Precision & Accuracy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enterprise-grade calculations with support for complex networking scenarios and industry standards
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Cloud className="h-6 w-6 text-primary" />
                  <CardTitle>Multi-Cloud Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Compare costs and configurations across AWS, Azure, and Google Cloud Platform with real-time pricing
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <CardTitle>Best Practices</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built-in recommendations following cloud based networking best practices and security guidelines
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20" role="region" aria-labelledby="faq-heading">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and answers to common cloud based networking questions
            </p>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Cloud Based Network Calculator
              </h3>
              <p className="text-background/70">
                Professional cloud based networking tools for modern infrastructure planning and optimization.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Tools</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <button 
                    onClick={() => scrollToSection('calculator')} 
                    className="hover:text-background/90 transition-colors" 
                    aria-label="Navigate to Subnet Calculator section"
                  >
                    Subnet Calculator
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('calculator')} 
                    className="hover:text-background/90 transition-colors" 
                    aria-label="Navigate to IP Allocation section"
                  >
                    IP Allocation
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('calculator')} 
                    className="hover:text-background/90 transition-colors" 
                    aria-label="Navigate to Cost Estimation section"
                  >
                    Cost Estimation
                  </button>
                </li>
                <li>Security Analysis</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Cloud Providers</h4>
              <ul className="space-y-2 text-background/70">
                <li>Amazon AWS</li>
                <li>Microsoft Azure</li>
                <li>Google Cloud</li>
                <li>Multi-Cloud</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-background/70">
                <li>
                  <button 
                    onClick={() => scrollToSection('faq')} 
                    className="hover:text-background/90 transition-colors" 
                    aria-label="Navigate to Documentation section"
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('benefits')} 
                    className="hover:text-background/90 transition-colors" 
                    aria-label="Navigate to Best Practices section"
                  >
                    Best Practices
                  </button>
                </li>
                <li>API Reference</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/70">
            <p>&copy; 2024 Cloud Based Networking Solutions Calculator. Built with modern web technologies for professional network planning.</p>
          </div>
        </div>
      </footer>

      <UserFeedbackSystem />
    </div>
  );
};

export default Index;
