import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Sparkles } from "lucide-react"

interface UpgradeButtonProps {
  children: React.ReactNode
}

export function UpgradeButton({ children }: UpgradeButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Get access to advanced features like detailed submission analytics, developer notifications, and more.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Premium Features:</h4>
            <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Detailed submission analytics
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Developer email notifications
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Advanced filtering and search
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Export functionality
              </li>
            </ul>
          </div>
          <Button className="w-full" onClick={() => window.location.href = '/dashboard/settings/billing'}>
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 