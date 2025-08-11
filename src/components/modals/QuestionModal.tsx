import { Book, HelpCircle, MessageSquare, ShoppingCart, ArrowUpRight } from "lucide-react";
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
    icon: <Book className="h-5 w-5" />,
    label: "Documentation",
    description: "Learn how to use Mantlz",
    href: "https://doc.mantlz.com",
    color: "bg-blue-500/10 text-amber-500 dark:text-amber-500"
  },
  {
    id: "support",
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Get Support",
    description: "Contact our support team",
    href: "mailto:contact@mantlz.com",
    color: "bg-green-500/10 text-green-600 dark:text-green-400"
  },
  {
    id: "feature-request",
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Feature Request",
    description: "Suggest new features",
    href: "https://mantlz.featurebase.app/",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
  },
  {
    id: "contact-sales",
    icon: <ShoppingCart className="h-5 w-5" />,
    label: "Contact Sales",
    description: "Talk to our sales team",
    href: "mailto:sale@mantlz.com",
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400"
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
      <DialogContent className="max-w-md bg-background dark:bg-background border border-zinc-200 dark:border-zinc-800 p-0 overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <DialogTitle className="text-lg font-semibold text-foreground mb-2">
              How can we help you?
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose the best option for your needs
            </p>
          </div>
          
          <div className="space-y-3">
            {helpOptions.map((option) => (
              <Link 
                key={option.id}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-lg bg-background border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200"
                onClick={() => onClose?.()}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${option.color}`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground text-sm">{option.label}</h3>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}