import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Server, Globe, Shield, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubnetVisualizationProps {
  networkAddress: string;
  broadcastAddress: string;
  usableRange: string;
  subnetMask: string;
  cidr: string;
  totalIPs: number;
  usableHosts: number;
  vlsmRecommendations?: Array<{
    hosts: number;
    cidr: string;
    mask: string;
    network: string;
  }>;
}

export const NetworkDiagramVisualizer: React.FC<SubnetVisualizationProps> = ({
  networkAddress,
  broadcastAddress,
  usableRange,
  subnetMask,
  cidr,
  totalIPs,
  usableHosts,
  vlsmRecommendations
}) => {
  const [firstUsable, lastUsable] = usableRange.split(' - ');
  
  // Calculate utilization percentage for visual representation
  const utilizationPercentage = (usableHosts / totalIPs) * 100;
  
  // Parse network for visualization
  const networkOctets = networkAddress.split('.');
  const networkBits = parseInt(cidr.split('/')[1]);
  const hostBits = 32 - networkBits;

  return (
    <div className="space-y-6">
      {/* Main Network Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Network Architecture Diagram
          </CardTitle>
          <CardDescription>
            Visual representation of your subnet structure and IP allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Network Overview */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-blue-500" />
                  <div>
                    <div className="font-semibold text-lg">{networkAddress}/{networkBits}</div>
                    <div className="text-sm text-muted-foreground">Network Address Space</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {totalIPs.toLocaleString()} Total IPs
                </Badge>
              </div>

              {/* IP Range Visualization */}
              <div className="relative bg-muted/30 rounded-lg p-6 border-2 border-primary/20">
                <div className="grid grid-cols-1 gap-4">
                  {/* Network Address */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border-l-4 border-red-500 rounded cursor-help">
                          <Shield className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <div className="font-mono font-semibold">{networkAddress}</div>
                            <div className="text-sm text-muted-foreground">Network Address</div>
                          </div>
                          <Badge variant="destructive">Reserved</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Network identifier - cannot be assigned to hosts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Gateway (First Usable) */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded cursor-help">
                          <Zap className="h-5 w-5 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-mono font-semibold">{firstUsable}</div>
                            <div className="text-sm text-muted-foreground">Gateway / First Usable IP</div>
                          </div>
                          <Badge className="bg-blue-500">Gateway</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Typically used for default gateway/router</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Usable Host Range */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 p-6 bg-green-500/10 border-l-4 border-green-500 rounded cursor-help">
                          <Server className="h-5 w-5 text-green-500" />
                          <div className="flex-1">
                            <div className="font-mono font-semibold text-sm mb-2">
                              {firstUsable.split('.').slice(0, 3).join('.')}.2 - {lastUsable.split('.').slice(0, 3).join('.')}.{parseInt(lastUsable.split('.')[3]) - 1}
                            </div>
                            <div className="text-sm text-muted-foreground mb-3">Usable Host Range</div>
                            
                            {/* Visual Utilization Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{usableHosts} assignable IPs</span>
                                <span>{utilizationPercentage.toFixed(1)}% utilization</span>
                              </div>
                              <div className="h-3 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                  style={{ width: `${utilizationPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-green-500">{usableHosts} Hosts</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>IP addresses available for host assignment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Last Usable */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 p-4 bg-orange-500/10 border-l-4 border-orange-500 rounded cursor-help">
                          <Server className="h-5 w-5 text-orange-500" />
                          <div className="flex-1">
                            <div className="font-mono font-semibold">{lastUsable}</div>
                            <div className="text-sm text-muted-foreground">Last Usable IP</div>
                          </div>
                          <Badge className="bg-orange-500">Last Host</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Last IP address available for host assignment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Broadcast Address */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border-l-4 border-red-500 rounded cursor-help">
                          <Network className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <div className="font-mono font-semibold">{broadcastAddress}</div>
                            <div className="text-sm text-muted-foreground">Broadcast Address</div>
                          </div>
                          <Badge variant="destructive">Reserved</Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Broadcast address - cannot be assigned to hosts</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Binary Representation */}
                <div className="mt-6 p-4 bg-background/50 rounded-lg border">
                  <div className="text-sm font-semibold mb-3">Subnet Mask Binary Breakdown</div>
                  <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                    {subnetMask.split('.').map((octet, idx) => {
                      const binary = parseInt(octet).toString(2).padStart(8, '0');
                      const isNetworkBits = ((idx + 1) * 8) <= networkBits;
                      
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="text-center font-semibold text-muted-foreground">
                            Octet {idx + 1}
                          </div>
                          <div className={`p-2 rounded text-center ${isNetworkBits ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-green-500/20 text-green-700 dark:text-green-300'}`}>
                            {binary}
                          </div>
                          <div className="text-center text-muted-foreground">
                            {octet}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded"></div>
                      <span>Network bits ({networkBits})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500/20 border border-green-500 rounded"></div>
                      <span>Host bits ({hostBits})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* VLSM Subnets Visualization */}
            {vlsmRecommendations && vlsmRecommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-t pt-6">
                  <Network className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">VLSM Subnet Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vlsmRecommendations.map((subnet, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline">Subnet {idx + 1}</Badge>
                        <Server className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Network:</span>
                          <span className="font-mono font-semibold">{subnet.network}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CIDR:</span>
                          <span className="font-mono font-semibold">{subnet.cidr}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mask:</span>
                          <span className="font-mono text-xs">{subnet.mask}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-muted-foreground">Hosts:</span>
                          <Badge className="bg-green-500">{subnet.hosts}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Diagram Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-red-500 bg-red-500/10"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-blue-500 bg-blue-500/10"></div>
              <span>Gateway</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-green-500 bg-green-500/10"></div>
              <span>Usable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-orange-500 bg-orange-500/10"></div>
              <span>Last Host</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-l-4 border-primary bg-primary/10"></div>
              <span>VLSM Subnet</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
