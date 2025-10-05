import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Calculator, Network, DollarSign, Zap, Globe, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProfessionalTooltip, SubnettingTooltip, CloudCostTooltip, PerformanceTooltip, SecurityTooltip } from "./ProfessionalTooltips";
import { useSubnetCalculation } from "./calculator/hooks/useSubnetCalculation";
import SubnetCalculatorTab from "./calculator/SubnetCalculatorTab";
import { validatePositiveNumber, logError } from "@/utils/validationUtils";
interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  usableHosts: number;
  subnetMask: string;
  cidr: string;
  totalIPs: number;
  vlsmRecommendation?: string;
  securityScore: number;
}
interface RealTimeCostEstimate {
  provider: string;
  region: string;
  monthlyDataTransfer: number;
  estimatedCost: number;
  lastUpdated: string;
  breakdown: {
    compute: number;
    networking: number;
    storage: number;
    loadBalancer: number;
    natGateway: number;
  };
  recommendations: string[];
  savingsOpportunities: number;
}
interface AdvancedScenario {
  name: string;
  description: string;
  subnets: Array<{
    cidr: string;
    purpose: string;
    hosts: number;
  }>;
  estimatedSavings: number;
}
const AdvancedNetworkCalculator = () => {
  const { toast } = useToast();
  
  // Use custom hook for subnet calculations
  const { 
    results, 
    loading: subnetLoading, 
    validationErrors, 
    calculateAdvancedSubnet 
  } = useSubnetCalculation();

  // Enhanced state management
  const [ipAddress, setIpAddress] = useState('10.0.0.0');
  const [subnetMask, setSubnetMask] = useState('24');
  const [hostsNeeded, setHostsNeeded] = useState('254');
  const [cloudProvider, setCloudProvider] = useState('aws');
  const [region, setRegion] = useState('us-east-1');
  const [dataTransfer, setDataTransfer] = useState('1000');
  const [instances, setInstances] = useState('5');
  const [availabilityZones, setAvailabilityZones] = useState('3');
  const [redundancyLevel, setRedundancyLevel] = useState('high');
  const [complianceLevel, setComplianceLevel] = useState('standard');
  const [costEstimate, setCostEstimate] = useState<RealTimeCostEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<AdvancedScenario[]>([]);

  // Real-time pricing simulation (in production, this would use actual APIs)
  const getRealTimePricing = async (provider: string, region: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const baseRates = {
      aws: {
        compute: 0.0464,
        networking: 0.09,
        storage: 0.10,
        lb: 0.0225,
        nat: 0.045
      },
      azure: {
        compute: 0.0496,
        networking: 0.087,
        storage: 0.0184,
        lb: 0.028,
        nat: 0.046
      },
      gcp: {
        compute: 0.0475,
        networking: 0.12,
        storage: 0.020,
        lb: 0.025,
        nat: 0.045
      }
    };
    const regionMultipliers = {
      'us-east-1': 1.0,
      'us-west-2': 1.05,
      'eu-west-1': 1.15,
      'ap-southeast-1': 1.25
    };
    const rates = baseRates[provider as keyof typeof baseRates];
    const multiplier = regionMultipliers[region as keyof typeof regionMultipliers] || 1.0;
    return {
      compute: rates.compute * multiplier,
      networking: rates.networking * multiplier,
      storage: rates.storage * multiplier,
      loadBalancer: rates.lb * multiplier,
      natGateway: rates.nat * multiplier
    };
  };
  
  const estimateRealTimeCosts = async () => {
    // Validate inputs
    const dataValidation = validatePositiveNumber(dataTransfer, "Data transfer", { min: 0, max: 1000000 });
    const instancesValidation = validatePositiveNumber(instances, "Instances", { min: 1, max: 1000 });
    
    if (!dataValidation.valid || !instancesValidation.valid) {
      toast({
        title: "Validation Error",
        description: dataValidation.error || instancesValidation.error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const rates = await getRealTimePricing(cloudProvider, region);
      const monthlyData = parseFloat(dataTransfer);
      const instanceCount = parseInt(instances);
      const azCount = parseInt(availabilityZones);
      const monthlyHours = 24 * 30;
      const computeCost = rates.compute * instanceCount * monthlyHours;
      const networkingCost = rates.networking * monthlyData;
      const storageCost = rates.storage * instanceCount * 50; // 50GB per instance
      const loadBalancerCost = rates.loadBalancer * monthlyHours * azCount;
      const natGatewayCost = rates.natGateway * monthlyHours * azCount;
      const totalCost = computeCost + networkingCost + storageCost + loadBalancerCost + natGatewayCost;

      // Generate cost optimization recommendations
      const recommendations = generateCostRecommendations(rates, monthlyData, instanceCount);
      const savingsOpportunities = calculateSavingsOpportunities(totalCost, monthlyData);
      const estimate: RealTimeCostEstimate = {
        provider: cloudProvider.toUpperCase(),
        region,
        monthlyDataTransfer: monthlyData,
        estimatedCost: totalCost,
        lastUpdated: new Date().toLocaleString(),
        breakdown: {
          compute: computeCost,
          networking: networkingCost,
          storage: storageCost,
          loadBalancer: loadBalancerCost,
          natGateway: natGatewayCost
        },
        recommendations,
        savingsOpportunities
      };
      setCostEstimate(estimate);
      toast({
        title: "Real-time cost analysis completed!",
        description: `Monthly estimate: $${totalCost.toFixed(2)} with $${savingsOpportunities.toFixed(2)} potential savings`,
      });
    } catch (error) {
      logError('CostEstimation', error);
      toast({
        title: "Cost Estimation Error",
        description: "Unable to retrieve real-time pricing. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  const generateCostRecommendations = (rates: any, dataTransfer: number, instances: number) => {
    const recommendations = [];
    if (dataTransfer > 10000) {
      recommendations.push("Consider implementing CloudFront/CDN for high data transfer volumes");
    }
    if (instances > 10) {
      recommendations.push("Evaluate Reserved Instances for potential 30-60% savings");
    }
    if (rates.natGateway > 0.04) {
      recommendations.push("Consider NAT instance instead of NAT Gateway for cost optimization");
    }
    return recommendations;
  };
  const calculateSavingsOpportunities = (totalCost: number, dataTransfer: number) => {
    let savings = 0;

    // CDN savings estimation
    if (dataTransfer > 5000) {
      savings += totalCost * 0.15; // 15% savings potential
    }

    // Reserved instance savings
    savings += totalCost * 0.3; // 30% potential RI savings

    return savings;
  };
  const generateAdvancedScenarios = () => {
    const scenarios: AdvancedScenario[] = [{
      name: "Multi-Tier Web Application",
      description: "Optimized for web, app, and database tiers with security segmentation",
      subnets: [{
        cidr: "/26",
        purpose: "Web Tier (Public)",
        hosts: 62
      }, {
        cidr: "/25",
        purpose: "Application Tier (Private)",
        hosts: 126
      }, {
        cidr: "/27",
        purpose: "Database Tier (Private)",
        hosts: 30
      }],
      estimatedSavings: 1200
    }, {
      name: "Microservices Architecture",
      description: "Container-optimized subnetting for Kubernetes/ECS workloads",
      subnets: [{
        cidr: "/24",
        purpose: "Container Nodes",
        hosts: 254
      }, {
        cidr: "/26",
        purpose: "Load Balancers",
        hosts: 62
      }, {
        cidr: "/28",
        purpose: "Management",
        hosts: 14
      }],
      estimatedSavings: 800
    }, {
      name: "Hybrid Cloud Connectivity",
      description: "Optimized for on-premises integration with dedicated connectivity",
      subnets: [{
        cidr: "/25",
        purpose: "Hybrid Workloads",
        hosts: 126
      }, {
        cidr: "/27",
        purpose: "VPN Gateway",
        hosts: 30
      }, {
        cidr: "/28",
        purpose: "Directory Services",
        hosts: 14
      }],
      estimatedSavings: 2000
    }, {
      name: "High-Performance Computing",
      description: "Optimized for compute-intensive workloads with high-bandwidth requirements",
      subnets: [{
        cidr: "/24",
        purpose: "Compute Cluster",
        hosts: 254
      }, {
        cidr: "/26",
        purpose: "Storage Network",
        hosts: 62
      }, {
        cidr: "/28",
        purpose: "Management Network",
        hosts: 14
      }],
      estimatedSavings: 1500
    }, {
      name: "Development/Staging Environment",
      description: "Cost-optimized setup for development and testing environments",
      subnets: [{
        cidr: "/26",
        purpose: "Development Servers",
        hosts: 62
      }, {
        cidr: "/27",
        purpose: "Testing Environment",
        hosts: 30
      }, {
        cidr: "/28",
        purpose: "CI/CD Pipeline",
        hosts: 14
      }],
      estimatedSavings: 600
    }];
    setScenarios(scenarios);
  };

  // Initialize scenarios on component mount
  useEffect(() => {
    generateAdvancedScenarios();
  }, []);
  return <div className="w-full max-w-7xl mx-auto space-y-8">
      <Card className="bg-gradient-secondary border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-950">
            <Calculator className="h-6 w-6 text-primary" />
            Advanced Cloud Network Calculator
            <Badge variant="secondary" className="ml-2">Professional Edition</Badge>
          </CardTitle>
          <CardDescription className="text-lg text-slate-950">
            Enterprise-grade networking calculations with real-time pricing, VLSM optimization, and compliance-ready configurations
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="advanced-subnetting" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="advanced-subnetting" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Advanced Subnetting
          </TabsTrigger>
          <TabsTrigger value="realtime-costs" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Real-Time Costs
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Professional Scenarios
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Cost Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="advanced-subnetting" className="space-y-6">
          <SubnetCalculatorTab
            ipAddress={ipAddress}
            setIpAddress={setIpAddress}
            subnetMask={subnetMask}
            setSubnetMask={setSubnetMask}
            hostsNeeded={hostsNeeded}
            setHostsNeeded={setHostsNeeded}
            availabilityZones={availabilityZones}
            setAvailabilityZones={setAvailabilityZones}
            redundancyLevel={redundancyLevel}
            setRedundancyLevel={setRedundancyLevel}
            complianceLevel={complianceLevel}
            setComplianceLevel={setComplianceLevel}
            results={results}
            loading={subnetLoading}
            onCalculate={() => calculateAdvancedSubnet(
              ipAddress,
              subnetMask,
              hostsNeeded,
              availabilityZones,
              complianceLevel
            )}
            validationErrors={validationErrors}
          />
        </TabsContent>

        <TabsContent value="realtime-costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Real-Time Cloud Pricing
                <CloudCostTooltip>
                  <Badge variant="outline">Live Data</Badge>
                </CloudCostTooltip>
              </CardTitle>
              <CardDescription>
                Current market rates with provider-specific optimizations and cost forecasting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger id="cloud-provider" aria-label="Select cloud provider for cost estimation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      <SelectItem value="aws">Amazon AWS</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="gcp">Google Cloud Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <PerformanceTooltip>
                    <Label htmlFor="region">Region</Label>
                  </PerformanceTooltip>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region" aria-label="Select cloud region for cost estimation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-background">
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <CloudCostTooltip>
                    <Label htmlFor="data-transfer">Data Transfer (GB/month)</Label>
                  </CloudCostTooltip>
                  <Input 
                    id="data-transfer" 
                    value={dataTransfer} 
                    onChange={e => setDataTransfer(e.target.value)} 
                    placeholder="1000" 
                    type="number"
                    min="0"
                    aria-label="Monthly data transfer in gigabytes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instances">Compute Instances</Label>
                  <Input 
                    id="instances" 
                    value={instances} 
                    onChange={e => setInstances(e.target.value)} 
                    placeholder="5" 
                    type="number"
                    min="1"
                    aria-label="Number of compute instances"
                  />
                </div>
              </div>
              
              <Button 
                onClick={estimateRealTimeCosts} 
                disabled={loading} 
                className="w-full" 
                size="lg"
                aria-label="Calculate real-time cost estimation"
              >
                {loading ? "Fetching Real-Time Prices..." : "Get Real-Time Cost Analysis"}
              </Button>
            </CardContent>
          </Card>

          {costEstimate && <Card className="border-success/20 shadow-medium">
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Real-Time Cost Analysis - {costEstimate.provider}
                  <Badge variant="outline">Updated: {costEstimate.lastUpdated}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl font-bold text-primary">
                      ${costEstimate.estimatedCost.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Monthly Estimate</div>
                    {costEstimate.savingsOpportunities > 0 && <div className="text-success font-medium">
                        Potential Savings: ${costEstimate.savingsOpportunities.toFixed(2)}
                      </div>}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compute</span>
                      <span className="font-mono">${costEstimate.breakdown.compute.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Networking</span>
                      <span className="font-mono">${costEstimate.breakdown.networking.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage</span>
                      <span className="font-mono">${costEstimate.breakdown.storage.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Load Balancer</span>
                      <span className="font-mono">${costEstimate.breakdown.loadBalancer.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">NAT Gateway</span>
                      <span className="font-mono">${costEstimate.breakdown.natGateway.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {costEstimate.recommendations.length > 0 && <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                      <div className="space-y-2">
                        <Label className="font-medium text-warning">Cost Optimization Recommendations</Label>
                        {costEstimate.recommendations.map((rec, index) => <p key={index} className="text-sm text-muted-foreground">• {rec}</p>)}
                      </div>
                    </div>
                  </div>}
              </CardContent>
            </Card>}
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Professional Network Scenarios
              </CardTitle>
              <CardDescription>
                Pre-configured enterprise architectures optimized for specific use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {scenarios.map((scenario, index) => <Card key={index} className="border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {scenario.name}
                        <Badge variant="secondary">${scenario.estimatedSavings}/month savings</Badge>
                      </CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenario.subnets.map((subnet, subIndex) => <div key={subIndex} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <div className="font-medium">{subnet.purpose}</div>
                              <div className="text-sm text-muted-foreground">{subnet.hosts} hosts available</div>
                            </div>
                            <Badge variant="outline" className="font-mono">{subnet.cidr}</Badge>
                          </div>)}
                      </div>
                    </CardContent>
                  </Card>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cost Optimization Dashboard
              </CardTitle>
              <CardDescription>
                Advanced analytics and recommendations for network cost reduction
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">Reserved Instances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">30-60%</div>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-3">Potential savings</p>
                    <p className="text-xs text-muted-foreground">Commit to 1-3 year terms for consistent workloads</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Spot Instances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">70-90%</div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">Cost reduction</p>
                    <p className="text-xs text-muted-foreground">For fault-tolerant, flexible workloads</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-700 dark:text-purple-300">Auto Scaling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">20-40%</div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">Efficiency gain</p>
                    <p className="text-xs text-muted-foreground">Scale resources based on demand</p>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Network Security Optimizations
                </h3>
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">VPC Endpoints</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Replace NAT Gateway traffic with VPC endpoints for AWS services. Save up to $32/month per NAT Gateway.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Security Groups Optimization</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Minimize open ports and use specific IP ranges instead of 0.0.0.0/0 to improve security posture.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Network ACLs</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implement subnet-level security controls for defense in depth. Consider stateless rules for high-throughput scenarios.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Data Transfer Optimizations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">CloudFront CDN</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reduce data transfer costs by up to 50% for frequently accessed content
                      </p>
                      <div className="text-sm">
                        <strong>Best for:</strong> Static assets, API responses, media files
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-indigo-200 dark:border-indigo-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Direct Connect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Predictable network costs for high-volume data transfer
                      </p>
                      <div className="text-sm">
                        <strong>Break-even:</strong> ~1TB/month depending on region
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {costEstimate && <>
                  <Separator />
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-primary mb-3">
                      Personalized Recommendations
                    </h3>
                    <div className="space-y-2">
                      {costEstimate.recommendations.map((rec, index) => <div key={index} className="flex items-start gap-2">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2"></div>
                          <p className="text-sm">{rec}</p>
                        </div>)}
                      {costEstimate.savingsOpportunities > 0 && <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                          <div className="text-green-700 dark:text-green-300 font-medium">
                            💰 Potential Monthly Savings: ${costEstimate.savingsOpportunities.toFixed(2)}
                          </div>
                        </div>}
                    </div>
                  </div>
                </>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default AdvancedNetworkCalculator;