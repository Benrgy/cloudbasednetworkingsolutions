import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Network, Monitor, Zap, DollarSign, BarChart3, PieChart } from "lucide-react";

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

interface VisualOutputsProps {
  subnetResults?: SubnetResult;
  costResults?: CostEstimate;
  type: 'subnet' | 'cost' | 'allocation';
}

const VisualOutputs: React.FC<VisualOutputsProps> = ({ 
  subnetResults, 
  costResults, 
  type 
}) => {
  
  const renderSubnetVisualization = () => {
    if (!subnetResults) return null;

    const utilizationPercentage = (subnetResults.usableHosts / subnetResults.totalIPs) * 100;
    const wastedIPs = subnetResults.totalIPs - subnetResults.usableHosts - 2; // -2 for network and broadcast

    return (
      <div className="space-y-6">
        {/* Network Overview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Architecture Visualization
            </CardTitle>
            <CardDescription>
              Visual representation of your subnet configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Network diagram representation */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6 border-2 border-dashed border-blue-300 dark:border-blue-700">
                <div className="text-center space-y-2">
                  <div className="font-mono text-lg font-bold">{subnetResults.networkAddress}{subnetResults.cidr}</div>
                  <div className="text-sm text-muted-foreground">Network Range</div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div className="font-mono text-sm">{subnetResults.networkAddress}</div>
                    <div className="text-xs text-muted-foreground">Network Address</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="font-bold text-green-700 dark:text-green-300">
                      {subnetResults.usableHosts.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Usable Hosts</div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div className="font-mono text-sm">{subnetResults.broadcastAddress}</div>
                    <div className="text-xs text-muted-foreground">Broadcast Address</div>
                  </div>
                </div>
              </div>
            </div>

            {/* IP Utilization Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">IP Address Utilization</h4>
                <Badge variant="outline">{utilizationPercentage.toFixed(1)}% Usable</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usable Hosts ({subnetResults.usableHosts.toLocaleString()})</span>
                  <span className="text-green-600 dark:text-green-400">
                    {((subnetResults.usableHosts / subnetResults.totalIPs) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(subnetResults.usableHosts / subnetResults.totalIPs) * 100} 
                  className="h-3"
                />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Reserved (2 addresses)</span>
                  <span>{((2 / subnetResults.totalIPs) * 100).toFixed(1)}%</span>
                </div>
                <Progress 
                  value={(2 / subnetResults.totalIPs) * 100} 
                  className="h-2"
                />
                
                {wastedIPs > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-orange-600 dark:text-orange-400">
                      <span>Wasted IPs ({wastedIPs.toLocaleString()})</span>
                      <span>{((wastedIPs / subnetResults.totalIPs) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={(wastedIPs / subnetResults.totalIPs) * 100} 
                      className="h-2"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Optimization Recommendations
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {utilizationPercentage < 50 && (
                  <li>• Consider using a larger CIDR (smaller subnet) to reduce IP waste</li>
                )}
                {subnetResults.usableHosts > 1000 && (
                  <li>• Large subnet detected - consider segmentation for better security</li>
                )}
                <li>• Plan for 20-30% future growth when sizing subnets</li>
                <li>• Use consistent IP addressing schemes across environments</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCostVisualization = () => {
    if (!costResults) return null;

    const totalCost = costResults.estimatedCost;
    const breakdown = costResults.breakdown;
    
    // Calculate percentages
    const computePercent = (breakdown.compute / totalCost) * 100;
    const networkingPercent = (breakdown.networking / totalCost) * 100;
    const storagePercent = (breakdown.storage / totalCost) * 100;

    return (
      <div className="space-y-6">
        {/* Cost Overview */}
        <Card className="border-success/20 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown Visualization
            </CardTitle>
            <CardDescription>
              Monthly cost analysis for {costResults.provider}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Total cost display */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">
                ${totalCost.toFixed(2)}
              </div>
              <div className="text-muted-foreground">
                Estimated monthly cost • {costResults.provider}
              </div>
              <Badge variant="outline" className="mt-2">
                {costResults.monthlyDataTransfer}GB data transfer
              </Badge>
            </div>

            {/* Cost breakdown chart */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Cost Distribution
              </h4>
              
              {/* Compute costs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compute Infrastructure</span>
                  <div className="text-right">
                    <div className="font-bold">${breakdown.compute.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{computePercent.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={computePercent} className="h-3" />
              </div>

              {/* Networking costs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Networking & Data Transfer</span>
                  <div className="text-right">
                    <div className="font-bold">${breakdown.networking.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{networkingPercent.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={networkingPercent} className="h-3" />
              </div>

              {/* Storage costs */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Storage & Backup</span>
                  <div className="text-right">
                    <div className="font-bold">${breakdown.storage.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{storagePercent.toFixed(1)}%</div>
                  </div>
                </div>
                <Progress value={storagePercent} className="h-3" />
              </div>
            </div>

            {/* Cost optimization recommendations */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Cost Optimization Opportunities
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                {networkingPercent > 40 && (
                  <li>• High networking costs - consider CDN or data locality optimization</li>
                )}
                {computePercent > 60 && (
                  <li>• Consider reserved instances for 20-40% compute savings</li>
                )}
                <li>• Implement auto-scaling to optimize resource utilization</li>
                <li>• Monitor and set up cost alerts for budget control</li>
                <li>• Review data transfer patterns for potential savings</li>
              </ul>
            </div>

            {/* Comparison with other providers */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${(totalCost * 0.95).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Est. AWS Cost</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  ${(totalCost * 1.05).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Est. Azure Cost</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  ${(totalCost * 0.90).toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">Est. GCP Cost</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAllocationVisualization = () => {
    return (
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            IP Allocation Visualization
          </CardTitle>
          <CardDescription>
            Visual IP allocation planning tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Advanced IP Allocation Tools</p>
            <p className="text-sm">Coming soon with VLAN segmentation and visual network mapping</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {type === 'subnet' && renderSubnetVisualization()}
      {type === 'cost' && renderCostVisualization()}
      {type === 'allocation' && renderAllocationVisualization()}
    </div>
  );
};

export default VisualOutputs;