import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Network, AlertCircle } from "lucide-react";
import { ProfessionalTooltip, SubnettingTooltip, SecurityTooltip } from "../ProfessionalTooltips";
import { NetworkDiagramVisualizer } from "../NetworkDiagramVisualizer";

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  usableHosts: number;
  usableRange?: string;
  subnetMask: string;
  cidr: string;
  totalIPs: number;
  vlsmRecommendation?: string;
  vlsmRecommendations?: Array<{
    hosts: number;
    cidr: string;
    mask: string;
    network: string;
  }>;
  securityScore: number;
}

interface SubnetCalculatorTabProps {
  ipAddress: string;
  setIpAddress: (value: string) => void;
  subnetMask: string;
  setSubnetMask: (value: string) => void;
  hostsNeeded: string;
  setHostsNeeded: (value: string) => void;
  availabilityZones: string;
  setAvailabilityZones: (value: string) => void;
  redundancyLevel: string;
  setRedundancyLevel: (value: string) => void;
  complianceLevel: string;
  setComplianceLevel: (value: string) => void;
  results: SubnetResult | null;
  loading: boolean;
  onCalculate: () => void;
  validationErrors?: {
    ipAddress?: string;
    hostsNeeded?: string;
  };
}

const SubnetCalculatorTab: React.FC<SubnetCalculatorTabProps> = ({
  ipAddress,
  setIpAddress,
  subnetMask,
  setSubnetMask,
  hostsNeeded,
  setHostsNeeded,
  availabilityZones,
  setAvailabilityZones,
  redundancyLevel,
  setRedundancyLevel,
  complianceLevel,
  setComplianceLevel,
  results,
  loading,
  onCalculate,
  validationErrors = {}
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Enterprise Subnet Calculator
            <SecurityTooltip>
              <Badge variant="outline">Security Optimized</Badge>
            </SecurityTooltip>
          </CardTitle>
          <CardDescription>
            VLSM-optimized calculations with security scoring and compliance recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <SubnettingTooltip>
                <Label htmlFor="ip-address">Network Address</Label>
              </SubnettingTooltip>
              <Input 
                id="ip-address" 
                value={ipAddress} 
                onChange={(e) => setIpAddress(e.target.value)} 
                placeholder="10.0.0.0"
                aria-label="Network IP address for subnet calculation"
                aria-invalid={!!validationErrors.ipAddress}
                aria-describedby={validationErrors.ipAddress ? "ip-error" : undefined}
                className={validationErrors.ipAddress ? "border-destructive" : ""}
              />
              {validationErrors.ipAddress && (
                <p id="ip-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.ipAddress}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <SubnettingTooltip>
                <Label htmlFor="subnet-mask">CIDR Notation</Label>
              </SubnettingTooltip>
              <Select value={subnetMask} onValueChange={setSubnetMask}>
                <SelectTrigger id="subnet-mask" aria-label="Select CIDR notation for subnet mask">
                  <SelectValue placeholder="Select CIDR" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  {[16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(cidr => (
                    <SelectItem key={cidr} value={cidr.toString()}>
                      /{cidr} ({Math.pow(2, 32 - cidr) - 2} hosts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hosts-needed">Required Hosts</Label>
              <Input 
                id="hosts-needed" 
                value={hostsNeeded} 
                onChange={(e) => setHostsNeeded(e.target.value)} 
                placeholder="254" 
                type="number"
                min="1"
                aria-label="Number of hosts needed in subnet"
                aria-invalid={!!validationErrors.hostsNeeded}
                aria-describedby={validationErrors.hostsNeeded ? "hosts-error" : undefined}
                className={validationErrors.hostsNeeded ? "border-destructive" : ""}
              />
              {validationErrors.hostsNeeded && (
                <p id="hosts-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {validationErrors.hostsNeeded}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <ProfessionalTooltip content="Number of availability zones for high availability and disaster recovery">
                <Label htmlFor="availability-zones">Availability Zones</Label>
              </ProfessionalTooltip>
              <Select value={availabilityZones} onValueChange={setAvailabilityZones}>
                <SelectTrigger id="availability-zones">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="1">Single AZ</SelectItem>
                  <SelectItem value="2">Multi AZ (2)</SelectItem>
                  <SelectItem value="3">Multi AZ (3) - Recommended</SelectItem>
                  <SelectItem value="4">Multi AZ (4+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ProfessionalTooltip content="Redundancy level affects cost and availability SLA">
                <Label htmlFor="redundancy">Redundancy Level</Label>
              </ProfessionalTooltip>
              <Select value={redundancyLevel} onValueChange={setRedundancyLevel}>
                <SelectTrigger id="redundancy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="basic">Basic (99.9% SLA)</SelectItem>
                  <SelectItem value="standard">Standard (99.95% SLA)</SelectItem>
                  <SelectItem value="high">High (99.99% SLA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <ProfessionalTooltip content="Compliance requirements affect security controls and audit logging">
                <Label htmlFor="compliance">Compliance Level</Label>
              </ProfessionalTooltip>
              <Select value={complianceLevel} onValueChange={setComplianceLevel}>
                <SelectTrigger id="compliance">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced (PCI-DSS)</SelectItem>
                  <SelectItem value="strict">Strict (HIPAA/SOC2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={onCalculate} 
            disabled={loading} 
            className="w-full" 
            size="lg"
            aria-label="Calculate subnet configuration"
          >
            {loading ? "Calculating..." : "Calculate Advanced Subnet"}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-primary/20 shadow-medium">
          <CardHeader>
            <CardTitle className="text-primary">Subnet Calculation Results</CardTitle>
            <CardDescription>
              Optimized configuration with security scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Network Address</Label>
                <div className="text-lg font-mono">{results.networkAddress}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Broadcast Address</Label>
                <div className="text-lg font-mono">{results.broadcastAddress}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Subnet Mask</Label>
                <div className="text-lg font-mono">{results.subnetMask}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">CIDR Notation</Label>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {results.cidr}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Usable Hosts</Label>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {results.usableHosts.toLocaleString()}
                </Badge>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Security Score</Label>
                <Badge 
                  variant={results.securityScore >= 80 ? "default" : "destructive"} 
                  className="text-lg px-3 py-1"
                >
                  {results.securityScore}%
                </Badge>
              </div>
            </div>
            
            {results.vlsmRecommendation && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">VLSM Recommendation</h4>
                <p className="text-sm text-muted-foreground">{results.vlsmRecommendation}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {results && results.usableRange && (
        <NetworkDiagramVisualizer
          networkAddress={results.networkAddress}
          broadcastAddress={results.broadcastAddress}
          usableRange={results.usableRange}
          subnetMask={results.subnetMask}
          cidr={results.cidr}
          totalIPs={results.totalIPs}
          usableHosts={results.usableHosts}
          vlsmRecommendations={results.vlsmRecommendations}
        />
      )}
    </div>
  );
};

export default SubnetCalculatorTab;
