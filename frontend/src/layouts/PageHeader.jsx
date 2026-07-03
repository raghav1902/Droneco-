import React from 'react';
import { ChevronRight } from 'lucide-react';

const PageHeader = ({ 
  title, 
  description, 
  breadcrumbs = [], 
  action 
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} className="mx-2" />}
              <span className={idx === breadcrumbs.length - 1 ? "font-medium text-foreground" : "hover:text-foreground cursor-pointer"}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && (
          <div className="flex shrink-0 items-center gap-2">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
