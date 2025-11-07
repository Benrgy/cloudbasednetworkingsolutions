import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { validateIPv4, validateCIDR, validatePositiveNumber, logError } from "@/utils/validationUtils";

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

interface ValidationErrors {
  ipAddress?: string;
  hostsNeeded?: string;
}

export const useSubnetCalculation = () => {
  const { toast } = useToast();
  const [results, setResults] = useState<SubnetResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const calculateSecurityScore = (mask: number, azCount: number, compliance: string) => {
    let score = 50;
    
    // Subnet size scoring (smaller subnets = higher security)
    if (mask >= 28) score += 25;
    else if (mask >= 26) score += 15;
    else if (mask >= 24) score += 10;
    
    // Multi-AZ scoring
    if (azCount >= 3) score += 15;
    else if (azCount >= 2) score += 10;
    
    // Compliance scoring
    if (compliance === 'strict') score += 10;
    else if (compliance === 'enhanced') score += 5;
    
    return Math.min(100, score);
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

  const validateInputs = useCallback((
    ipAddress: string,
    subnetMask: string,
    hostsNeeded: string
  ): boolean => {
    const errors: ValidationErrors = {};
    
    // Validate IP address
    const ipValidation = validateIPv4(ipAddress);
    if (!ipValidation.valid) {
      errors.ipAddress = ipValidation.error;
    }
    
    // Validate CIDR
    const cidrValidation = validateCIDR(subnetMask);
    if (!cidrValidation.valid) {
      toast({
        title: "Invalid CIDR",
        description: cidrValidation.error,
        variant: "destructive",
      });
      return false;
    }
    
    // Validate hosts needed
    const hostsValidation = validatePositiveNumber(hostsNeeded, "Hosts needed", { min: 1, max: 16777214 });
    if (!hostsValidation.valid) {
      errors.hostsNeeded = hostsValidation.error;
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  }, [toast]);

  const calculateAdvancedSubnet = useCallback(async (
    ipAddress: string,
    subnetMask: string,
    hostsNeeded: string,
    availabilityZones: string,
    complianceLevel: string
  ) => {
    if (!validateInputs(ipAddress, subnetMask, hostsNeeded)) {
      return;
    }

    setLoading(true);
    try {
      const ip = ipAddress.split('.').map(num => parseInt(num));
      const mask = parseInt(subnetMask);
      const hostsRequired = parseInt(hostsNeeded);

      // Advanced subnet calculations
      const networkBits = 32 - mask;
      const totalHosts = Math.pow(2, networkBits);
      const usableHosts = totalHosts - 2;

      // VLSM recommendations
      const getOptimalCIDR = (hosts: number) => {
        const bitsNeeded = Math.ceil(Math.log2(hosts + 2));
        return 32 - bitsNeeded;
      };

      const optimalCIDR = getOptimalCIDR(hostsRequired);
      const vlsmRecommendation = optimalCIDR !== mask 
        ? `Consider using /${optimalCIDR} for optimal IP utilization (${Math.pow(2, 32 - optimalCIDR) - 2} hosts)` 
        : 'Current CIDR is optimal for requirements';

      // Security scoring
      const securityScore = calculateSecurityScore(mask, parseInt(availabilityZones), complianceLevel);

      // Network address calculation
      const maskBits = (0xffffffff << (32 - mask)) >>> 0;
      const networkAddr = ip.map((octet, i) => 
        octet & ((maskBits >>> (24 - i * 8)) & 0xff)
      );
      const broadcastAddr = networkAddr.map((octet, i) => 
        octet | (~((maskBits >>> (24 - i * 8)) & 0xff) & 0xff)
      );
      
      const networkAddress = networkAddr.join('.');
      const broadcastAddress = broadcastAddr.join('.');
      const subnetMaskAddr = calculateSubnetMask(mask);
      
      // Calculate usable IP range
      const firstUsable = [...networkAddr];
      firstUsable[3] += 1;
      const lastUsable = [...broadcastAddr];
      lastUsable[3] -= 1;
      const usableRange = `${firstUsable.join('.')} - ${lastUsable.join('.')}`;
      
      // Generate VLSM recommendations if subnet is larger than needed
      const vlsmRecommendations: Array<{
        hosts: number;
        cidr: string;
        mask: string;
        network: string;
      }> = [];
      
      if (hostsRequired < usableHosts && hostsRequired > 0) {
        // Create 3-4 VLSM subnets based on requirements
        const optimalBits = 32 - getOptimalCIDR(hostsRequired);
        const subnetSize = Math.pow(2, optimalBits);
        const maxSubnets = Math.min(4, Math.floor(totalHosts / subnetSize));
        
        for (let i = 0; i < maxSubnets; i++) {
          const subnetNetwork = [...networkAddr];
          subnetNetwork[3] = (subnetNetwork[3] + (i * subnetSize)) % 256;
          
          vlsmRecommendations.push({
            hosts: subnetSize - 2,
            cidr: `/${32 - optimalBits}`,
            mask: calculateSubnetMask(32 - optimalBits),
            network: subnetNetwork.join('.')
          });
        }
      }

      const result: SubnetResult = {
        networkAddress,
        broadcastAddress,
        usableRange,
        usableHosts,
        subnetMask: subnetMaskAddr,
        cidr: `/${mask}`,
        totalIPs: totalHosts,
        vlsmRecommendation,
        vlsmRecommendations: vlsmRecommendations.length > 0 ? vlsmRecommendations : undefined,
        securityScore
      };

      setResults(result);

      toast({
        title: "Advanced subnet calculation completed!",
        description: `Optimized for ${usableHosts} hosts with ${securityScore}% security score`,
      });
    } catch (error) {
      logError('SubnetCalculation', error);
      toast({
        title: "Calculation Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, validateInputs]);

  return {
    results,
    loading,
    validationErrors,
    calculateAdvancedSubnet,
  };
};
