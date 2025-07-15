import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Zap, TrendingUp, Shield } from "lucide-react";

interface GoogleAdsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onInteraction?: (action: string) => void;
  variant?: string;
  timeOnPage?: number;
  scrollProgress?: number;
}

const GoogleAdsPopup: React.FC<GoogleAdsPopupProps> = ({ 
  isOpen, 
  onClose, 
  onInteraction,
  variant = 'default',
  timeOnPage = 0,
  scrollProgress = 0
}) => {
  
  const handleInteraction = (action: string) => {
    onInteraction?.(action);
    if (action === 'cta_click') {
      // Track high-value interaction
      (window as any).gtag?.('event', 'conversion', {
        'send_to': 'AW-XXXXXXX/XXXXX',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-secondary border-primary/20 shadow-strong">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-5 w-5 text-primary" />
              Supercharge Your Network
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-base">
            Get professional network design and optimization services
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <div className="font-medium">Enterprise Solutions</div>
                <div className="text-sm text-muted-foreground">Custom network architecture design</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/20">
              <Shield className="h-5 w-5 text-accent-foreground flex-shrink-0" />
              <div>
                <div className="font-medium">Security Audits</div>
                <div className="text-sm text-muted-foreground">Comprehensive network security assessment</div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="hero" 
              className="flex-1" 
              onClick={() => {
                handleInteraction('cta_click');
                onClose();
              }}
            >
              {variant === 'urgent' ? 'Get Started Now' : 'Learn More'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                handleInteraction('dismiss');
                onClose();
              }}
            >
              Maybe Later
            </Button>
          </div>

          {variant === 'data_driven' && (
            <div className="text-xs text-center space-y-1">
              <div className="text-muted-foreground">
                Time on page: {Math.floor(timeOnPage)}s • Progress: {Math.floor(scrollProgress)}%
              </div>
              <div className="text-accent">
                🎯 Personalized recommendations available
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            Professional consulting services • No obligation
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleAdsPopup;