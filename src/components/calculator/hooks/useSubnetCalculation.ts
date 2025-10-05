import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { validateIPv4, validateCIDR, validatePositiveNumber, logError } from "@/utils/validationUtils";

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
      const networkAddress = ip.slice(0, 3).join('.') + '.0';
      const broadcastOctet = Math.min(255, ip[3] + Math.pow(2, Math.min(networkBits, 8)) - 1);
      const broadcastAddress = ip.slice(0, 3).join('.') + '.' + broadcastOctet;
      const subnetMaskAddr = calculateSubnetMask(mask);

      const result: SubnetResult = {
        networkAddress,
        broadcastAddress,
        usableHosts,
        subnetMask: subnetMaskAddr,
        cidr: `/${mask}`,
        totalIPs: totalHosts,
        vlsmRecommendation,
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
