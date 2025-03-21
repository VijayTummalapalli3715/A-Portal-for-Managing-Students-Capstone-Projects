// src/components/ui/card.jsx
import { cn } from "@/lib/utils";

export function Card({ className, ...props }) {
  return <div className={cn("rounded-lg border bg-white shadow-sm p-4", className)} {...props} />;
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("border-b pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-sm text-gray-600", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("py-2", className)} {...props} />;
}
