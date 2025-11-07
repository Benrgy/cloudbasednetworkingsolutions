import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  aws: { status: 'yes' | 'no' | 'partial'; details: string };
  azure: { status: 'yes' | 'no' | 'partial'; details: string };
  gcp: { status: 'yes' | 'no' | 'partial'; details: string };
}

const StatusIcon = ({ status }: { status: 'yes' | 'no' | 'partial' }) => {
  if (status === 'yes') return <CheckCircle className="h-5 w-5 text-green-600" />;
  if (status === 'no') return <XCircle className="h-5 w-5 text-red-600" />;
  return <MinusCircle className="h-5 w-5 text-yellow-600" />;
};

const comparisonData: ComparisonFeature[] = [
  {
    feature: "Free Tier Data Transfer",
    aws: { status: 'partial', details: '100 GB/month outbound' },
    azure: { status: 'partial', details: '100 GB/month outbound' },
    gcp: { status: 'yes', details: '1 TB/month worldwide (excluding China/Australia)' }
  },
  {
    feature: "Global VPC",
    aws: { status: 'no', details: 'Regional VPCs only' },
    azure: { status: 'no', details: 'Regional VNETs only' },
    gcp: { status: 'yes', details: 'Single global VPC across regions' }
  },
  {
    feature: "Private Connectivity",
    aws: { status: 'yes', details: 'Direct Connect, PrivateLink' },
    azure: { status: 'yes', details: 'ExpressRoute, Private Link' },
    gcp: { status: 'yes', details: 'Cloud Interconnect, Private Service Connect' }
  },
  {
    feature: "Network Security Groups",
    aws: { status: 'yes', details: 'Security Groups + Network ACLs' },
    azure: { status: 'yes', details: 'Network Security Groups + Application Security Groups' },
    gcp: { status: 'yes', details: 'Firewall Rules + Hierarchical Policies' }
  },
  {
    feature: "Load Balancing Options",
    aws: { status: 'yes', details: 'ALB, NLB, CLB, Gateway LB' },
    azure: { status: 'yes', details: 'Application Gateway, Load Balancer, Front Door' },
    gcp: { status: 'yes', details: 'Global/Regional LB, Internal LB' }
  },
  {
    feature: "DDoS Protection",
    aws: { status: 'yes', details: 'AWS Shield (Standard free, Advanced paid)' },
    azure: { status: 'yes', details: 'DDoS Protection (Basic free, Standard paid)' },
    gcp: { status: 'yes', details: 'Cloud Armor (included)' }
  },
  {
    feature: "CDN Service",
    aws: { status: 'yes', details: 'CloudFront - 200+ edge locations' },
    azure: { status: 'yes', details: 'Azure CDN - 100+ edge locations' },
    gcp: { status: 'yes', details: 'Cloud CDN - 100+ edge locations' }
  },
  {
    feature: "IPv6 Support",
    aws: { status: 'yes', details: 'Full IPv6 support in VPC' },
    azure: { status: 'yes', details: 'IPv6 for VNETs and Load Balancers' },
    gcp: { status: 'yes', details: 'Native IPv6 support' }
  }
];

const pricingData = [
  {
    category: "Data Transfer (per GB)",
    aws: "$0.09 (first 10TB/month)",
    azure: "$0.087 (first 10TB/month)",
    gcp: "$0.085 (worldwide)"
  },
  {
    category: "Load Balancer",
    aws: "$0.0225/hour + $0.008/LCU",
    azure: "$0.025/hour + $0.005/GB",
    gcp: "$0.025/hour + $0.008/GB"
  },
  {
    category: "VPN Connection",
    aws: "$0.05/hour",
    azure: "$0.04/hour",
    gcp: "$0.05/hour"
  },
  {
    category: "NAT Gateway",
    aws: "$0.045/hour + $0.045/GB",
    azure: "$0.045/hour + $0.045/GB",
    gcp: "$0.044/hour + $0.045/GB"
  }
];

export const CloudProviderComparison = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Feature Comparison: AWS vs Azure vs GCP</CardTitle>
          <CardDescription>
            Compare networking features across major cloud providers to make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">
                    <Badge variant="outline" className="text-sm">AWS</Badge>
                  </th>
                  <th className="text-center p-4 font-semibold">
                    <Badge variant="outline" className="text-sm">Azure</Badge>
                  </th>
                  <th className="text-center p-4 font-semibold">
                    <Badge variant="outline" className="text-sm">GCP</Badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{item.feature}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        <StatusIcon status={item.aws.status} />
                        <span className="text-xs text-muted-foreground text-center">
                          {item.aws.details}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        <StatusIcon status={item.azure.status} />
                        <span className="text-xs text-muted-foreground text-center">
                          {item.azure.details}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-2">
                        <StatusIcon status={item.gcp.status} />
                        <span className="text-xs text-muted-foreground text-center">
                          {item.gcp.details}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Pricing Comparison</CardTitle>
          <CardDescription>
            Typical pricing for common networking services (as of 2025 - US East region)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Service</th>
                  <th className="text-center p-4 font-semibold">AWS</th>
                  <th className="text-center p-4 font-semibold">Azure</th>
                  <th className="text-center p-4 font-semibold">GCP</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-medium">{item.category}</td>
                    <td className="p-4 text-center text-sm">{item.aws}</td>
                    <td className="p-4 text-center text-sm">{item.azure}</td>
                    <td className="p-4 text-center text-sm">{item.gcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Prices vary by region and are subject to change. Use our Cost Estimation tool for accurate, real-time pricing based on your specific requirements.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Which Provider Should You Choose?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Badge>AWS</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Best for: Mature ecosystem, widest service selection, extensive partner network
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Most comprehensive service catalog</li>
                <li>✓ Best for enterprise migrations</li>
                <li>✓ Strong compliance certifications</li>
                <li>✗ Complex pricing structure</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Badge>Azure</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Best for: Microsoft ecosystem integration, hybrid cloud, enterprise Windows workloads
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Best Microsoft integration</li>
                <li>✓ Strong hybrid cloud capabilities</li>
                <li>✓ Good for .NET applications</li>
                <li>✗ Steeper learning curve</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Badge>GCP</Badge>
              </h4>
              <p className="text-sm text-muted-foreground">
                Best for: Data analytics, machine learning, Kubernetes workloads, cost optimization
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Best for data analytics/ML</li>
                <li>✓ Simpler pricing model</li>
                <li>✓ Global VPC by default</li>
                <li>✗ Smaller service ecosystem</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
