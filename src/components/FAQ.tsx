import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Network, Cloud, DollarSign, Shield, Zap } from "lucide-react";

const FAQ = () => {
  const faqData = [
    {
      id: "subnetting-basics",
      icon: <Network className="h-5 w-5" />,
      question: "What is subnetting and why is it important for cloud networking?",
      answer: `Subnetting is a fundamental network segmentation technique that divides a larger network into smaller, more manageable subnetworks (subnets). In cloud environments, proper subnetting is crucial for several reasons that directly impact performance, security, and cost optimization.

      **Understanding Subnetting Fundamentals**
      
      Subnetting works by borrowing bits from the host portion of an IP address to create network segments. This process allows network administrators to create logical divisions within their IP address space, enabling better organization and control over network traffic. The subnet mask determines which portion of the IP address represents the network and which represents individual hosts.
      
      **Cloud-Specific Benefits**
      
      In cloud platforms like AWS, Azure, and Google Cloud, subnetting serves multiple critical purposes. First, it enables micro-segmentation for enhanced security by isolating different tiers of applications (web, application, database) into separate subnets. This segmentation prevents lateral movement of threats and reduces the attack surface.
      
      **Performance and Routing Optimization**
      
      Proper subnetting reduces broadcast domains, which improves network performance by limiting unnecessary traffic. In cloud environments, this translates to reduced latency and improved application response times. Cloud providers use subnetting to implement efficient routing between availability zones and regions, ensuring optimal data flow.
      
      **Cost Management Through Subnetting**
      
      Cloud providers often charge for data transfer between different network segments. Strategic subnetting can minimize cross-subnet traffic, reducing networking costs. By grouping related resources in the same subnet, organizations can optimize data transfer patterns and reduce charges for inter-subnet communication.
      
      **Compliance and Governance**
      
      Many regulatory frameworks require network segmentation for data protection. Subnetting enables organizations to implement network-level controls that satisfy compliance requirements. Different subnets can have varying security policies, access controls, and monitoring configurations based on the sensitivity of the data they contain.
      
      **Scalability and Future Planning**
      
      Effective subnetting strategies provide room for growth while maintaining organization. Cloud environments benefit from hierarchical IP addressing schemes that can accommodate expansion without requiring major architectural changes. This forward-thinking approach prevents costly network redesigns as organizations scale.
      
      **Best Practices for Cloud Subnetting**
      
      When implementing subnetting in cloud environments, consider factors such as availability zone distribution, traffic patterns, security requirements, and integration with hybrid cloud architectures. Plan for adequate IP address space while avoiding waste, and implement consistent naming conventions for easier management.`
    },
    {
      id: "ip-allocation",
      icon: <Zap className="h-5 w-5" />,
      question: "How do I optimize IP allocation for multi-cloud environments?",
      answer: `IP allocation optimization in multi-cloud environments requires careful planning, strategic address space management, and deep understanding of each cloud provider's networking models. Effective IP allocation strategies ensure scalability, prevent conflicts, and enable seamless connectivity across different cloud platforms.

      **Multi-Cloud IP Address Space Planning**
      
      The foundation of multi-cloud IP optimization begins with comprehensive address space planning. Organizations should establish a global IP addressing scheme that prevents overlapping address ranges across different cloud providers. This typically involves dividing RFC 1918 private address space (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) into provider-specific blocks.
      
      **Address Conservation Strategies**
      
      In multi-cloud environments, IP address conservation becomes critical due to the limited nature of private address space. Implement Variable Length Subnet Masking (VLSM) to allocate IP addresses based on actual requirements rather than using fixed subnet sizes. This approach can reduce IP waste by up to 70% in typical deployments.
      
      **Cross-Cloud Connectivity Considerations**
      
      When planning IP allocation for multi-cloud environments, consider connectivity requirements between different cloud providers. VPN connections, private interconnects (like AWS Direct Connect, Azure ExpressRoute, or Google Cloud Interconnect), and transit gateways all have specific IP addressing requirements that must be accommodated in your allocation strategy.
      
      **Provider-Specific Optimization Techniques**
      
      Each cloud provider has unique characteristics that affect IP allocation strategies. AWS VPCs support multiple availability zones with distinct subnets, requiring careful planning for high availability. Azure's virtual networks support address space expansion, allowing for more flexible growth patterns. Google Cloud's global VPC model enables cross-region communication without complex routing.
      
      **Automation and Infrastructure as Code**
      
      Implement Infrastructure as Code (IaC) tools like Terraform, CloudFormation, or ARM templates to ensure consistent IP allocation across cloud environments. Automation reduces human error and enables rapid deployment of standardized network configurations. Create templates that incorporate IP allocation best practices and can be reused across different projects and environments.
      
      **Security and Compliance Integration**
      
      IP allocation strategies must align with security and compliance requirements. Implement network segmentation that supports Zero Trust security models, where each network segment has specific access controls and monitoring. Different compliance frameworks may require specific network isolation requirements that influence IP allocation decisions.
      
      **Monitoring and Management Tools**
      
      Deploy IP Address Management (IPAM) solutions that provide visibility across multiple cloud environments. These tools help track IP utilization, identify conflicts, and plan for future capacity needs. Cloud-native IPAM solutions can integrate with provider APIs to provide real-time visibility into IP allocation across your multi-cloud infrastructure.
      
      **Cost Optimization Through Strategic Allocation**
      
      Optimize costs by understanding each provider's pricing model for networking resources. Some providers charge for unused elastic IP addresses, while others have different rates for data transfer between regions or availability zones. Align your IP allocation strategy with these cost structures to minimize unnecessary expenses while maintaining required functionality.`
    },
    {
      id: "cloud-costs",
      icon: <DollarSign className="h-5 w-5" />,
      question: "What factors influence cloud networking costs and how can I optimize them?",
      answer: `Cloud networking costs are influenced by multiple interconnected factors that vary significantly across providers and usage patterns. Understanding these cost drivers and implementing optimization strategies can result in substantial savings while maintaining or improving network performance and reliability.

      **Primary Cost Drivers in Cloud Networking**
      
      Data transfer costs typically represent the largest component of cloud networking expenses. These charges apply to data movement between regions, availability zones, and external networks. Each cloud provider has different pricing models: AWS charges for outbound data transfer and cross-region traffic, Azure has complex pricing based on zones and regions, while Google Cloud offers more generous free tiers for certain types of transfers.
      
      **Bandwidth and Traffic Pattern Analysis**
      
      Analyzing traffic patterns reveals optimization opportunities that can significantly reduce costs. Implement network monitoring tools to identify high-volume data flows, peak usage periods, and unnecessary cross-region traffic. Applications that frequently transfer large datasets between regions can benefit from architectural changes such as data locality optimization or caching strategies.
      
      **Load Balancer and Gateway Optimization**
      
      Load balancers and application gateways contribute significantly to networking costs through both fixed monthly charges and data processing fees. Optimize these costs by right-sizing load balancer capacity, implementing intelligent traffic routing, and consolidating multiple small applications onto shared load balancing infrastructure where security requirements permit.
      
      **Content Delivery Network (CDN) Integration**
      
      Strategic CDN implementation can dramatically reduce data transfer costs by serving content from edge locations closer to end users. This approach minimizes origin server traffic and reduces cross-region data transfer charges. Configure appropriate cache policies and content expiration rules to maximize CDN effectiveness while ensuring content freshness.
      
      **Network Architecture Cost Optimization**
      
      Design network architectures that minimize expensive data flows. Implement hub-and-spoke topologies for multi-region deployments, use transit gateways to consolidate VPN connections, and optimize route tables to ensure traffic takes the most cost-effective paths. Consider implementing network compression and deduplication technologies to reduce data transfer volumes.
      
      **Reserved Capacity and Committed Use Discounts**
      
      Many cloud providers offer significant discounts for committed network capacity usage. AWS offers Reserved Instances that include networking benefits, Azure provides Reserved Capacity for specific networking services, and Google Cloud has Committed Use Discounts that can apply to network resources. Analyze historical usage patterns to identify opportunities for these cost-saving commitments.
      
      **Egress Traffic Management**
      
      Egress traffic costs can be substantial, especially for data-intensive applications. Implement strategies such as data compression, efficient data formats (like Parquet for analytics), and intelligent caching to reduce egress volumes. Consider using provider-specific services like AWS S3 Transfer Acceleration or Azure CDN to optimize both performance and costs.
      
      **Multi-Cloud Cost Arbitrage**
      
      Different cloud providers have varying strengths and pricing models for networking services. Some organizations implement multi-cloud strategies specifically to leverage cost advantages: using one provider for compute-intensive workloads with minimal data transfer, another for content delivery, and a third for backup and archive scenarios with infrequent access patterns.
      
      **Automation and Cost Monitoring**
      
      Implement automated cost monitoring and alerting systems that provide real-time visibility into networking expenses. Use cloud provider cost management tools, third-party solutions, or custom dashboards to track spending trends and identify cost anomalies quickly. Set up automated responses for cost threshold breaches to prevent unexpected charges.`
    },
    {
      id: "security-best-practices",
      icon: <Shield className="h-5 w-5" />,
      question: "What are the essential security best practices for cloud network design?",
      answer: `Cloud network security requires a comprehensive, multi-layered approach that addresses threats at every level of the network stack. Modern cloud environments face sophisticated attacks that exploit vulnerabilities in network design, configuration, and management. Implementing robust security practices is essential for protecting data, maintaining compliance, and ensuring business continuity.

      **Zero Trust Network Architecture**
      
      Zero Trust represents a fundamental shift from traditional perimeter-based security models to a "never trust, always verify" approach. In cloud environments, this means implementing micro-segmentation, continuous authentication, and least-privilege access controls. Every network connection, whether internal or external, must be authenticated, authorized, and encrypted. This approach significantly reduces the impact of security breaches by limiting lateral movement within the network.
      
      **Network Segmentation and Isolation**
      
      Implement comprehensive network segmentation using virtual private clouds (VPCs), subnets, and security groups. Create distinct network zones for different application tiers, separating web servers, application servers, and databases into isolated segments. Use private subnets for sensitive resources and implement jump boxes or bastion hosts for secure administrative access. This segmentation limits blast radius and prevents unauthorized access to critical resources.
      
      **Identity and Access Management Integration**
      
      Integrate network security with robust Identity and Access Management (IAM) systems. Implement network-level access controls that verify user and device identity before granting network access. Use technologies like Software-Defined Perimeter (SDP) or Zero Trust Network Access (ZTNA) to create secure, encrypted tunnels for remote access. Multi-factor authentication should be mandatory for all administrative access to network infrastructure.
      
      **Encryption and Secure Communications**
      
      Implement end-to-end encryption for all network communications, including data in transit and at rest. Use strong encryption protocols like TLS 1.3 for web traffic, IPSec for VPN connections, and encrypted storage for sensitive data. Establish secure key management practices using cloud provider key management services or hardware security modules (HSMs) for maximum protection.
      
      **Network Monitoring and Threat Detection**
      
      Deploy comprehensive network monitoring solutions that provide real-time visibility into network traffic, security events, and potential threats. Implement Security Information and Event Management (SIEM) systems that correlate network logs with security events from other sources. Use machine learning-based anomaly detection to identify unusual traffic patterns that may indicate security breaches or data exfiltration attempts.
      
      **DDoS Protection and Resilience**
      
      Implement multi-layered DDoS protection using cloud provider services, third-party solutions, and architectural design principles. Use cloud-based DDoS protection services that can absorb large-scale attacks before they reach your infrastructure. Design networks with redundancy and auto-scaling capabilities to maintain availability during attacks. Implement rate limiting and traffic shaping to prevent resource exhaustion.
      
      **Compliance and Regulatory Requirements**
      
      Ensure network designs meet relevant compliance requirements such as PCI DSS, HIPAA, SOC 2, or GDPR. Implement network controls that support audit requirements, including detailed logging, access controls, and data flow monitoring. Use cloud provider compliance certifications and compliance automation tools to maintain ongoing compliance posture.
      
      **Incident Response and Recovery Planning**
      
      Develop comprehensive incident response plans that address network security breaches. Implement network isolation capabilities that can quickly quarantine compromised systems without affecting business operations. Establish secure communication channels for incident response teams and create network forensics capabilities for post-incident analysis. Regular disaster recovery testing ensures network recovery procedures are effective and well-understood.
      
      **Security Automation and Orchestration**
      
      Implement Security Orchestration, Automation, and Response (SOAR) platforms that can automatically respond to network security threats. Use Infrastructure as Code principles to ensure consistent security configurations across environments. Implement automated compliance checking and remediation to maintain security posture as networks evolve and scale.`
    },
    {
      id: "multi-cloud-networking",
      icon: <Cloud className="h-5 w-5" />,
      question: "How do I design effective multi-cloud networking strategies?",
      answer: `Multi-cloud networking strategies require careful architectural planning, deep understanding of provider-specific services, and robust management frameworks to ensure seamless connectivity, optimal performance, and cost efficiency across diverse cloud environments. Organizations adopt multi-cloud approaches for various reasons including risk mitigation, vendor negotiation leverage, and leveraging best-of-breed services from different providers.

      **Strategic Multi-Cloud Architecture Planning**
      
      Effective multi-cloud networking begins with comprehensive architecture planning that considers connectivity requirements, data flow patterns, latency requirements, and compliance constraints. Establish clear criteria for workload placement across different cloud providers based on factors such as geographic proximity to users, specific service capabilities, cost considerations, and regulatory requirements. Create a service mesh architecture that provides consistent networking, security, and observability across all cloud environments.
      
      **Connectivity Options and Technologies**
      
      Implement diverse connectivity options to ensure robust, high-performance connections between cloud environments. Use dedicated network connections like AWS Direct Connect, Azure ExpressRoute, or Google Cloud Interconnect for consistent, low-latency connectivity. Supplement these with VPN connections for redundancy and backup connectivity. Consider SD-WAN solutions that can intelligently route traffic across multiple connection types based on performance, cost, and reliability criteria.
      
      **Data Synchronization and Replication Strategies**
      
      Design comprehensive data synchronization strategies that maintain consistency across multi-cloud environments while minimizing data transfer costs. Implement near-real-time replication for critical data using cloud-native replication services or third-party solutions. Use eventual consistency models where appropriate to reduce synchronization overhead. Consider data locality regulations that may require data to remain within specific geographic boundaries.
      
      **Network Security Across Cloud Boundaries**
      
      Implement consistent security policies across all cloud environments using centralized security management platforms. Deploy universal security controls such as next-generation firewalls, intrusion detection systems, and secure web gateways that can operate across multiple cloud providers. Establish secure inter-cloud communication channels using encrypted tunnels and certificate-based authentication. Implement zero-trust principles that treat all cloud environments as untrusted networks requiring verification.
      
      **Performance Optimization and Monitoring**
      
      Deploy comprehensive monitoring solutions that provide end-to-end visibility across multi-cloud networks. Use Application Performance Monitoring (APM) tools that can track user experience across different cloud environments and identify performance bottlenecks. Implement intelligent traffic routing that can direct users to the optimal cloud environment based on current performance metrics, geographic location, and service availability.
      
      **Cost Management and Optimization**
      
      Develop sophisticated cost management strategies that consider the complex pricing models of different cloud providers. Implement cost allocation frameworks that can track expenses across multiple clouds and business units. Use cloud cost optimization tools that can recommend resource right-sizing, reserved capacity purchases, and optimal placement strategies. Consider the total cost of ownership including data transfer charges, management overhead, and operational complexity.
      
      **Disaster Recovery and Business Continuity**
      
      Design comprehensive disaster recovery strategies that leverage the geographic distribution and service diversity of multi-cloud environments. Implement automated failover mechanisms that can redirect traffic and restore services across different cloud providers. Use cross-cloud backup and replication strategies to ensure data protection and rapid recovery capabilities. Regular disaster recovery testing validates the effectiveness of multi-cloud continuity plans.
      
      **Governance and Management Frameworks**
      
      Establish robust governance frameworks that ensure consistent policies, procedures, and standards across all cloud environments. Implement Infrastructure as Code practices that enable consistent network provisioning and configuration management across different cloud providers. Use cloud management platforms that provide unified visibility and control across multi-cloud environments while respecting provider-specific capabilities and limitations.
      
      **Integration and Interoperability Considerations**
      
      Design integration strategies that enable seamless communication and data exchange between services deployed across different cloud providers. Use API gateways and service mesh technologies to abstract provider-specific networking details and provide consistent interfaces for application development. Implement data format standardization and protocol translation capabilities to ensure interoperability across diverse cloud services and platforms.`
    },
    {
      id: "troubleshooting-network-issues",
      icon: <HelpCircle className="h-5 w-5" />,
      question: "What are common cloud networking issues and how do I troubleshoot them?",
      answer: `Cloud networking troubleshooting requires systematic approaches, comprehensive monitoring tools, and deep understanding of cloud provider networking models. Network issues in cloud environments can manifest in various ways including connectivity failures, performance degradation, security breaches, and cost anomalies. Effective troubleshooting methodologies enable rapid issue identification and resolution while minimizing business impact.

      **Systematic Troubleshooting Methodology**
      
      Implement a structured troubleshooting approach that progresses from broad network-level analysis to specific component investigation. Begin with comprehensive network topology mapping to understand current configuration and identify potential failure points. Use layered analysis that examines network connectivity at different OSI model layers, starting with physical connectivity and progressing through routing, transport, and application layers. Document all troubleshooting steps and findings to build institutional knowledge and improve future response times.
      
      **Connectivity and Routing Issues**
      
      Connectivity problems often stem from misconfigured security groups, network access control lists (NACLs), or routing tables. Implement systematic testing using tools like ping, traceroute, and telnet to identify where connectivity breaks down. Verify security group rules allow necessary traffic on required ports and protocols. Check routing tables to ensure proper path selection and verify that subnets are correctly associated with route tables. Use cloud provider network analysis tools to visualize traffic flows and identify routing loops or suboptimal paths.
      
      **Performance Degradation Analysis**
      
      Network performance issues require comprehensive analysis of bandwidth utilization, latency patterns, and packet loss metrics. Implement network performance monitoring tools that provide real-time visibility into traffic patterns, connection quality, and resource utilization. Analyze traffic flows to identify bandwidth bottlenecks, particularly during peak usage periods. Use application-specific monitoring to correlate network performance with user experience metrics and business impact.
      
      **DNS Resolution Problems**
      
      DNS issues are common sources of connectivity and performance problems in cloud environments. Implement comprehensive DNS monitoring that tracks resolution times, failure rates, and cache effectiveness. Verify DNS server configurations and ensure proper failover mechanisms are in place. Use DNS analysis tools to identify resolution delays and implement optimization strategies such as DNS caching, content delivery networks, and geographically distributed DNS servers.
      
      **Security and Access Control Issues**
      
      Security-related network issues often manifest as unexpected connectivity failures or performance degradation. Implement comprehensive security monitoring that can correlate network events with security policies and access control changes. Use security information and event management (SIEM) systems to identify patterns that may indicate security breaches or policy violations. Regular security audits help identify misconfigurations that could lead to security vulnerabilities or operational issues.
      
      **Load Balancer and Traffic Distribution Problems**
      
      Load balancer issues can cause service availability problems and uneven traffic distribution. Implement health check monitoring that verifies backend server availability and response times. Analyze traffic distribution patterns to identify servers that may be overwhelmed or underutilized. Use load balancer logs and metrics to identify configuration issues, health check failures, and capacity constraints that may affect service delivery.
      
      **Inter-Cloud and Hybrid Connectivity Issues**
      
      Multi-cloud and hybrid environments introduce additional complexity in troubleshooting connectivity between different cloud providers or on-premises infrastructure. Implement end-to-end network monitoring that provides visibility across all connection types including VPNs, dedicated connections, and internet-based links. Use network path analysis tools to identify where connectivity breaks down and implement redundant connectivity options to ensure business continuity.
      
      **Automated Monitoring and Alerting Systems**
      
      Deploy comprehensive monitoring solutions that can automatically detect network issues and alert operations teams before problems impact users. Implement intelligent alerting that reduces false positives while ensuring critical issues receive immediate attention. Use machine learning-based anomaly detection to identify unusual patterns that may indicate emerging problems. Create automated runbooks that can guide troubleshooting efforts and potentially resolve common issues automatically.
      
      **Documentation and Knowledge Management**
      
      Maintain comprehensive documentation of network configurations, troubleshooting procedures, and known issues. Create network diagrams that accurately reflect current topology and are updated as configurations change. Develop troubleshooting guides specific to your environment that include common issues, resolution steps, and escalation procedures. Implement knowledge management systems that capture lessons learned from previous incidents and make this information easily accessible to operations teams.`
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto space-y-8">
      <Card className="bg-gradient-secondary border-0 shadow-medium">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-3xl">
            <HelpCircle className="h-8 w-8 text-primary" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-lg max-w-3xl mx-auto">
            Comprehensive answers to common cloud networking questions, optimized for technical accuracy and practical implementation guidance
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-medium">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4 hover:shadow-soft transition-smooth">
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{faq.icon}</div>
                    <span className="font-medium text-lg">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-2">
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                    {faq.answer.split('\n\n').map((paragraph, index) => {
                      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                        return (
                          <h4 key={index} className="font-semibold text-foreground mt-6 mb-3 text-base">
                            {paragraph.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      return (
                        <p key={index} className="mb-4">
                          {paragraph.split('**').map((part, partIndex) => {
                            if (partIndex % 2 === 1) {
                              return <strong key={partIndex} className="font-semibold text-foreground">{part}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
};

export default FAQ;