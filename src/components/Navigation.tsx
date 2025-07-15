import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calculator, Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
          >
            <Calculator className="h-6 w-6 text-primary" />
            Cloud Based Network Calculator
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-to-use')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How to Use
            </button>
            <button 
              onClick={() => scrollToSection('calculator')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Calculator
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefits
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => scrollToSection('calculator')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('how-to-use')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                How to Use
              </button>
              <button 
                onClick={() => scrollToSection('calculator')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Calculator
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-left text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                FAQ
              </button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => scrollToSection('calculator')}
                className="w-fit"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;