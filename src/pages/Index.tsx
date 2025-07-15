import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Calculator, Network, Zap, ArrowRight, CheckCircle, TrendingUp, Shield } from "lucide-react";
import NetworkCalculator from "@/components/NetworkCalculator";
import GoogleAdsPopup from "@/components/GoogleAdsPopup";
import FAQ from "@/components/FAQ";

const Index = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Subnet Calculator",
      description: "Calculate network addresses, broadcast addresses, and host capacity with precision"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "IP Allocation Planning",
      description: "Optimize IP address distribution across your cloud infrastructure"
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Multi-Cloud Cost Estimation",
      description: "Compare networking costs across AWS, Azure, and Google Cloud Platform"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security Best Practices",
      description: "Built-in recommendations for secure cloud network design"
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
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
              <Button variant="hero" size="xl" className="group">
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="xl">
                View Documentation
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-3 group-hover:bg-white/20 transition-smooth">
                    <div className="text-white flex items-center justify-center h-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How to Use</h2>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <NetworkCalculator />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Our Calculator</h2>
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
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
                <li>Subnet Calculator</li>
                <li>IP Allocation</li>
                <li>Cost Estimation</li>
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
                <li>Documentation</li>
                <li>Best Practices</li>
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

      {/* Google Ads Popup */}
      <GoogleAdsPopup 
        isOpen={showPopup} 
        onClose={() => setShowPopup(false)} 
      />
    </div>
  );
};

export default Index;
