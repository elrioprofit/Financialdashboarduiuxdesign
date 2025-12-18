import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle, AlertTriangle, XCircle, X } from "lucide-react";
import { Button } from "./ui/button";

interface AlertBannerProps {
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function AlertBanner({ type, title, message, action, onDismiss }: AlertBannerProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case "error":
        return "destructive" as const;
      default:
        return "default" as const;
    }
  };

  const getBgClass = () => {
    switch (type) {
      case "error":
        return "bg-destructive/10 border-destructive/30";
      case "warning":
        return "bg-warning/10 border-warning/30";
      default:
        return "bg-secondary/10 border-secondary/30";
    }
  };

  return (
    <Alert variant={getVariant()} className={getBgClass()}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-1">{message}</AlertDescription>
          {action && (
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </Alert>
  );
}
