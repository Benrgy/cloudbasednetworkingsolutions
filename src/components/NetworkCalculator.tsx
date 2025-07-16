import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Network, DollarSign, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  usableHosts: number;
  subnetMask: string;
  cidr: string;
  totalIPs: number;
}

interface CostEstimate {
  provider: string;
  monthlyDataTransfer: number;
  estimatedCost: number;
  breakdown: {
    compute: number;
    networking: number;
    storage: number;
  };
}

const NetworkCalculator = () => {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState('192.168.1.0');
  const [subnetMask, setSubnetMask] = useState('24');
  const [hostsNeeded, setHostsNeeded] = useState('100');
  const [cloudProvider, setCloudProvider] = useState('aws');
  const [region, setRegion] = useState('us-east-1');
  const [dataTransfer, setDataTransfer] = useState('1000');
  const [instances, setInstances] = useState('5');
  const [results, setResults] = useState<SubnetResult | null>(null);
  const [costEstimate, setCostEstimate] = useState<CostEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateSubnet = () => {
    setLoading(true);
    try {
      const ip = ipAddress.split('.').map(num => parseInt(num));
      const mask = parseInt(subnetMask);
      
      // Calculate network address
      const networkBits = 32 - mask;
      const totalHosts = Math.pow(2, networkBits);
      const usableHosts = totalHosts - 2; // Subtract network and broadcast addresses
      
      // Simple subnet calculation for demo
      const networkAddress = ipAddress.split('.').slice(0, 3).join('.') + '.0';
      const broadcastOctet = parseInt(ipAddress.split('.')[3]) + Math.pow(2, Math.min(networkBits, 8)) - 1;
      const broadcastAddress = ipAddress.split('.').slice(0, 3).join('.') + '.' + Math.min(broadcastOctet, 255);
      
      const subnetMaskAddr = calculateSubnetMask(mask);
      
      const result: SubnetResult = {
        networkAddress,
        broadcastAddress,
        usableHosts,
        subnetMask: subnetMaskAddr,
        cidr: `/${mask}`,
        totalIPs: totalHosts
      };
      
      setResults(result);
      toast({
        title: "Subnet calculated successfully!",
        description: `Network supports ${usableHosts} usable hosts`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input values and try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const calculateSubnetMask = (cidr: number): string => {
    const mask = (0xffffffff << (32 - cidr)) >>> 0;
    return [
      (mask >>> 24) & 0xff,
      (mask >>> 16) & 0xff,
      (mask >>> 8) & 0xff,
      mask & 0xff
    ].join('.');
  };

  const estimateCosts = () => {
    setLoading(true);
    try {
      const monthlyData = parseFloat(dataTransfer);
      const instanceCount = parseInt(instances);
      
      // Simplified cost calculation for demo
      let computeRate = 0.10; // per hour per instance
      let networkingRate = 0.09; // per GB
      let storageRate = 0.10; // per GB per month
      
      // Adjust rates by provider
      switch (cloudProvider) {
        case 'azure':
          computeRate *= 1.05;
          networkingRate *= 0.95;
          break;
        case 'gcp':
          computeRate *= 0.95;
          networkingRate *= 1.10;
          break;
      }
      
      const monthlyHours = 24 * 30;
      const computeCost = computeRate * instanceCount * monthlyHours;
      const networkingCost = networkingRate * monthlyData;
      const storageCost = storageRate * instanceCount * 20; // 20GB per instance
      
      const totalCost = computeCost + networkingCost + storageCost;
      
      const estimate: CostEstimate = {
        provider: cloudProvider.toUpperCase(),
        monthlyDataTransfer: monthlyData,
        estimatedCost: totalCost,
        breakdown: {
          compute: computeCost,
          networking: networkingCost,
          storage: storageCost
        }
      };
      
      setCostEstimate(estimate);
      toast({
        title: "Cost estimated successfully!",
        description: `Monthly estimate: $${totalCost.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Estimation Error",
        description: "Please check your input values and try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <Card className="bg-gradient-secondary border-0 shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6 text-primary" />
            Cloud Based Networking Calculator
          </CardTitle>
          <CardDescription className="text-lg">
            Calculate subnetting, IP allocation, and estimate cloud based networking costs across AWS, Azure, and GCP
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="subnetting" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="subnetting" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Subnetting
          </TabsTrigger>
          <TabsTrigger value="allocation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            IP Allocation
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Estimation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subnetting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subnet Calculator</CardTitle>
              <CardDescription>
                Calculate subnet details including network address, broadcast address, and available hosts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input
                    id="ip-address"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="192.168.1.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subnet-mask">CIDR Notation</Label>
                  <Select value={subnetMask} onValueChange={setSubnetMask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CIDR" />
                    </SelectTrigger>
                    <SelectContent>
                      {[8, 16, 20, 22, 24, 26, 28, 30].map((cidr) => (
                        <SelectItem key={cidr} value={cidr.toString()}>
                          /{cidr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hosts-needed">Hosts Needed</Label>
                  <Input
                    id="hosts-needed"
                    value={hostsNeeded}
                    onChange={(e) => setHostsNeeded(e.target.value)}
                    placeholder="100"
                    type="number"
                  />
                </div>
              </div>
              <Button onClick={calculateSubnet} disabled={loading} className="w-full" size="lg">
                {loading ? "Calculating..." : "Calculate Subnet"}
              </Button>
            </CardContent>
          </Card>

          {results && (
            <Card className="border-primary/20 shadow-medium">
              <CardHeader>
                <CardTitle className="text-primary">Subnet Results</CardTitle>
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
                    <div className="text-lg font-mono">{results.cidr}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Usable Hosts</Label>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {results.usableHosts.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-muted-foreground">Total IPs</Label>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {results.totalIPs.toLocaleString()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>IP Allocation Planner</CardTitle>
              <CardDescription>
                Plan and visualize IP address allocation for your network infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Public Subnets</CardTitle>
                    <CardDescription>Internet-facing resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                        <span className="text-sm">Web Servers</span>
                        <Badge variant="outline" className="font-mono">10.0.1.0/24</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                        <span className="text-sm">Load Balancers</span>
                        <Badge variant="outline" className="font-mono">10.0.2.0/26</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-blue-50 dark:bg-blue-950 rounded">
                        <span className="text-sm">NAT Gateways</span>
                        <Badge variant="outline" className="font-mono">10.0.3.0/28</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">Private Subnets</CardTitle>
                    <CardDescription>Internal resources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                        <span className="text-sm">Application Servers</span>
                        <Badge variant="outline" className="font-mono">10.0.10.0/24</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                        <span className="text-sm">Database Servers</span>
                        <Badge variant="outline" className="font-mono">10.0.11.0/26</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-950 rounded">
                        <span className="text-sm">Cache Layer</span>
                        <Badge variant="outline" className="font-mono">10.0.12.0/28</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">VLAN Segmentation Recommendations</h3>
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">DMZ (Demilitarized Zone)</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          VLAN 10: Public-facing services like web servers and reverse proxies. Use /24 networks for flexibility.
                        </p>
                        <Badge variant="outline" className="mt-2 font-mono">10.0.10.0/24</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Internal Applications</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          VLAN 20: Application servers and middleware. Isolated from direct internet access.
                        </p>
                        <Badge variant="outline" className="mt-2 font-mono">10.0.20.0/24</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Database Tier</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          VLAN 30: Database servers with strict access controls. Minimum required IP addresses.
                        </p>
                        <Badge variant="outline" className="mt-2 font-mono">10.0.30.0/26</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <h4 className="font-medium">Management Network</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          VLAN 40: Infrastructure management, monitoring, and administrative access.
                        </p>
                        <Badge variant="outline" className="mt-2 font-mono">10.0.40.0/28</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">💡 Best Practices</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Reserve first and last subnets for future expansion</li>
                  <li>• Use consistent CIDR blocks across environments</li>
                  <li>• Plan for 3x current capacity to accommodate growth</li>
                  <li>• Document IP assignments and maintain an IP address management (IPAM) system</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Cost Estimator</CardTitle>
              <CardDescription>
                Estimate networking costs across AWS, Azure, and Google Cloud Platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cloud-provider">Cloud Provider</Label>
                  <Select value={cloudProvider} onValueChange={setCloudProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">Amazon AWS</SelectItem>
                      <SelectItem value="azure">Microsoft Azure</SelectItem>
                      <SelectItem value="gcp">Google Cloud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-transfer">Data Transfer (GB/month)</Label>
                  <Input
                    id="data-transfer"
                    value={dataTransfer}
                    onChange={(e) => setDataTransfer(e.target.value)}
                    placeholder="1000"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instances">Number of Instances</Label>
                  <Input
                    id="instances"
                    value={instances}
                    onChange={(e) => setInstances(e.target.value)}
                    placeholder="5"
                    type="number"
                  />
                </div>
              </div>
              <Button onClick={estimateCosts} disabled={loading} className="w-full" size="lg">
                {loading ? "Calculating..." : "Estimate Costs"}
              </Button>
            </CardContent>
          </Card>

          {costEstimate && (
            <Card className="border-success/20 shadow-medium">
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Estimate - {costEstimate.provider}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      ${costEstimate.estimatedCost.toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Estimated monthly cost</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-semibold">${costEstimate.breakdown.compute.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Compute</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-semibold">${costEstimate.breakdown.networking.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Networking</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-semibold">${costEstimate.breakdown.storage.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Storage</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    * Estimates are approximate and may vary based on actual usage, region, and current pricing.
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetworkCalculator;