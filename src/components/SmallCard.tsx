import * as React from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SmallCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function SmallCard({ icon: Icon, title, description, className }: SmallCardProps) {
  return (
    <Card className={cn("rounded-[28px] border-border/70 bg-surface/95 shadow-soft", className)}>
      <CardContent className="space-y-3 p-5">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm leading-6 text-muted-foreground">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
