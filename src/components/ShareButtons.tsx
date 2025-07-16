import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Copy, Mail, MessageSquare, Code, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title?: string;
  description?: string;
  url?: string;
  results?: any;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  title = "Cloud Based Networking Solutions Calculator",
  description = "Professional subnet calculator, IP allocation planner, and cloud cost estimator",
  url = window.location.href,
  results 
}) => {
  const { toast } = useToast();
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);

  const shareUrl = url;
  const shareTitle = title;
  const shareText = results 
    ? `${description}\n\nCalculation Results:\n${JSON.stringify(results, null, 2)}`
    : description;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const handleShareReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
    window.open(redditUrl, '_blank', 'width=600,height=600');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const embedCode = `<iframe 
  src="${shareUrl}?embed=true" 
  width="800" 
  height="600" 
  frameborder="0" 
  style="border: 1px solid #e2e8f0; border-radius: 8px;"
  title="Cloud Based Networking Calculator">
</iframe>`;

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toast({
        title: "Embed code copied!",
        description: "Widget embed code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy embed code to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Copy Link
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareLinkedIn}
        className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#005885] text-white border-[#0077b5]"
      >
        <Share2 className="h-4 w-4" />
        LinkedIn
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareTwitter}
        className="flex items-center gap-2 bg-[#1da1f2] hover:bg-[#0d8bd9] text-white border-[#1da1f2]"
      >
        <MessageSquare className="h-4 w-4" />
        Twitter
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareReddit}
        className="flex items-center gap-2 bg-[#ff4500] hover:bg-[#e63900] text-white border-[#ff4500]"
      >
        <Share2 className="h-4 w-4" />
        Reddit
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleEmailShare}
        className="flex items-center gap-2"
      >
        <Mail className="h-4 w-4" />
        Email
      </Button>

      <Dialog open={isEmbedDialogOpen} onOpenChange={setIsEmbedDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Code className="h-4 w-4" />
            Embed
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Embed Calculator Widget</DialogTitle>
            <DialogDescription>
              Copy this code to embed the calculator on your website or blog
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Widget Preview</CardTitle>
                <CardDescription>
                  This is how the calculator will appear on your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-muted-foreground/25">
                  <div className="text-center text-muted-foreground">
                    <Code className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Calculator Widget Preview</p>
                    <p className="text-xs">800x600 responsive iframe</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="embed-code">Embed Code</Label>
              <Textarea
                id="embed-code"
                value={embedCode}
                readOnly
                className="min-h-[120px] font-mono text-sm"
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsEmbedDialogOpen(false)}
              >
                Close
              </Button>
              <Button onClick={handleCopyEmbed} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copy Embed Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareButtons;