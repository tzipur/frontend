import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ButtonGroup({ children, className = '' }: ButtonGroupProps) {
  // In RTL, standard flex-row places the first DOM element on the right.
  // In LTR, it places the first DOM element on the left.
  // By placing the secondary button FIRST and primary button SECOND,
  // we automatically achieve the layout constraint: primary is on left in RTL, right in LTR.
  return (
    <div className={`flex flex-row gap-[clamp(0.5rem,1.5dvh,0.75rem)] w-full ${className}`}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        // Automatically make children flex-1 to fill the space equally
        return React.cloneElement(child as React.ReactElement<any>, {
          className: `${child.props.className || ''} flex-1`
        });
      })}
    </div>
  );
}
