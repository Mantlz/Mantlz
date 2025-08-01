import { Book, HelpCircle, MessageSquare, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog";

interface QuestionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

const helpOptions = [
  {
    id: "documentation",
    icon: <Book className="h-8 w-8 text-indigo-500" />,
    label: "Documentation",
    href: "https://doc.mantlz.com"
  },
  {
    id: "support",
    icon: <HelpCircle className="h-8 w-8 text-blue-500" />,
    label: "Support",
    href: "mailto:contact@mantlz.com"
  },
  {
    id: "feature-request",
    icon: <MessageSquare className="h-8 w-8 text-green-500" />,
    label: "Feature request",
    href: "https://mantlz.featurebase.app/"
  },
  {
    id: "contact-sales",
    icon: <ShoppingCart className="h-8 w-8 text-amber-500" />,
    label: "Contact sales",
    href: "mailto:sale@mantlz.com"
  }
];

export function QuestionModal({ isOpen, onClose, trigger }: QuestionModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-xl bg-background dark:bg-background border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <div className="p-8 pt-10">
          <DialogTitle className="text-xl font-semibold text-foreground text-center mb-2">
            How can we help?
          </DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-2 mb-8">
            Choose an option based on your needs.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {helpOptions.map((option) => (
              <Link 
                key={option.id}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-6 rounded-xl bg-background dark:bg-background border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer"
                onClick={() => onClose?.()}
              >
                <div className="flex justify-center items-center mb-3">
                  {option.icon}
                </div>
                <span className="text-sm font-medium text-foreground">{option.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}