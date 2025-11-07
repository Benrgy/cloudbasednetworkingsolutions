import { Helmet } from "react-helmet-async";

export const HowToSchema = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Calculate Subnets and Plan Cloud Network Infrastructure",
          "description": "Step-by-step guide to using our cloud-based networking calculator for subnet planning, IP allocation, and multi-cloud cost estimation",
          "image": "https://cloudbasednetworkingsolutions.com/og-image.png",
          "totalTime": "PT15M",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "tool": [
            {
              "@type": "HowToTool",
              "name": "Cloud Based Network Calculator"
            }
          ],
          "step": [
            {
              "@type": "HowToStep",
              "position": 1,
              "name": "Select Your Tool",
              "text": "Choose from subnet calculator, IP allocation planner, or cost estimation tool based on your needs. Use our Decision Helper if you're unsure which tool is best for your situation.",
              "image": "https://cloudbasednetworkingsolutions.com/og-image.png"
            },
            {
              "@type": "HowToStep",
              "position": 2,
              "name": "Input Network Parameters",
              "text": "Enter your IP address, CIDR notation, number of required hosts, availability zones, and redundancy requirements. For cost estimation, specify your cloud provider (AWS, Azure, or GCP), region, data transfer volumes, and instance counts.",
              "image": "https://cloudbasednetworkingsolutions.com/og-image.png"
            },
            {
              "@type": "HowToStep",
              "position": 3,
              "name": "Review Calculation Results",
              "text": "Receive detailed results including network address, broadcast address, usable host range, subnet mask, total IP count, VLSM recommendations, and security scoring. For cost estimates, see detailed breakdowns across compute, networking, and storage.",
              "image": "https://cloudbasednetworkingsolutions.com/og-image.png"
            },
            {
              "@type": "HowToStep",
              "position": 4,
              "name": "Optimize and Implement",
              "text": "Use the provided recommendations to optimize your network architecture. Implement security best practices, adjust subnet sizes for efficiency, and apply cost-saving strategies. Save or share your results with your team for collaboration.",
              "image": "https://cloudbasednetworkingsolutions.com/og-image.png"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};
