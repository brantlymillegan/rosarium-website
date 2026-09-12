'use client';

import { useId, useState, type ReactElement } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function ComingSoonTooltip({ children }: { children: ReactElement }) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={children}
        tabIndex={0}
        delay={150}
        closeOnClick={false}
        aria-describedby={open ? tooltipId : undefined}
      />
      <TooltipContent
        id={tooltipId}
        role="tooltip"
        sideOffset={10}
        className="coming-soon-tooltip"
      >
        Coming Soon
      </TooltipContent>
    </Tooltip>
  );
}
