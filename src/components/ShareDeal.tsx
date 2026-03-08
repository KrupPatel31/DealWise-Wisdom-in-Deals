import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareDealProps {
  title: string;
  price?: string;
  store?: string;
  url?: string;
  variant?: "icon" | "button";
  size?: "sm" | "default";
}

export const ShareDeal = ({
  title,
  price,
  store,
  url,
  variant = "icon",
  size = "sm",
}: ShareDealProps) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareText = price
    ? `🔥 Check out this deal: ${title} at ${price}${store ? ` on ${store}` : ""} — Found on DealWise!`
    : `🔥 Check out ${title}${store ? ` on ${store}` : ""} — Found on DealWise!`;

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
      "_blank"
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // user cancelled
      }
    }
  };

  // Use native share on mobile if available
  if (navigator.share && variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size}
        className="h-8 w-8 p-0"
        onClick={handleNativeShare}
        title="Share deal"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size={size} className="h-8 w-8 p-0" title="Share deal">
            <Share2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" size={size}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleWhatsApp} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitter} className="cursor-pointer">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X (Twitter)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
