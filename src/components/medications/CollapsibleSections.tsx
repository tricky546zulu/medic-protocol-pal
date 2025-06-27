
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardHeader, CardTitle
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StethoscopeIcon, InfoIcon, ChevronDownIcon, CheckCircle2Icon, AlertCircleIcon, ListChecksIcon, ActivityIcon } from 'lucide-react'; // Updated Icons
import type { Database } from '@/integrations/supabase/types';
import { cn } from '@/lib/utils';

type Indication = Database['public']['Tables']['medication_indications']['Row'];
type Administration = Database['public']['Tables']['medication_administration']['Row'];

interface CollapsibleSectionsProps {
  indications?: Indication[];
  administration?: Administration;
}

interface SectionItem {
  title: string;
  icon: React.ElementType;
  iconColorClass: string;
  bgColorClass: string;
  data: any[] | undefined;
  renderContent: (item: any, index: number) => React.ReactNode;
  idPrefix: string;
  collapsibleStateKey: string;
}

export const CollapsibleSections = ({ indications, administration }: CollapsibleSectionsProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    indications: true, // Default indications to open
    administration: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderIndicationsContent = (indication: Indication) => (
    <div key={indication.id} className="mb-4 last:mb-0">
      {indication.indication_type && (
         <Badge variant="secondary" className="mb-2 text-sm font-medium">
           {indication.indication_type}
         </Badge>
      )}
      <p className="text-sm text-foreground/90 leading-relaxed">{indication.indication_text}</p>
    </div>
  );

  const renderAdministrationList = (items: string[] | undefined, title: string, Icon: React.ElementType, iconColor: string, itemKeyPrefix: string) => {
    if (!items || items.length === 0) return null;
    return (
      <div>
        <h4 className="font-semibold text-foreground mb-2 text-base flex items-center gap-2">
          <Icon className={cn("h-4 w-4", iconColor)} />
          {title}:
        </h4>
        <ul className="space-y-2 pl-1">
          {items.map((item, index) => (
            <li key={`${itemKeyPrefix}-${index}`} className="text-sm text-foreground/90 flex items-start gap-2">
              <span className={cn("mt-1 flex-shrink-0", iconColor)}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const sections: SectionItem[] = [
    {
      title: 'Indications & Clinical Uses',
      icon: StethoscopeIcon,
      iconColorClass: 'text-blue-600',
      bgColorClass: 'bg-blue-500/10',
      data: indications,
      renderContent: renderIndicationsContent,
      idPrefix: 'indication',
      collapsibleStateKey: 'indications',
    },
    {
      title: 'Administration & Preparation',
      icon: InfoIcon, // Changed from Pill to InfoIcon for broader scope
      iconColorClass: 'text-green-600',
      bgColorClass: 'bg-green-500/10',
      data: administration ? [administration] : undefined, // Wrap admin for consistent mapping
      renderContent: (admin: Administration) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderAdministrationList(admin.preparation, 'Preparation', ListChecksIcon, 'text-sky-600', 'prep')}
          {renderAdministrationList(admin.administration_notes, 'Administration Notes', ActivityIcon, 'text-indigo-600', 'admin-note')}
          {renderAdministrationList(admin.monitoring, 'Monitoring', CheckCircle2Icon, 'text-teal-600', 'monitor')}
          {renderAdministrationList(admin.adverse_effects, 'Adverse Effects', AlertCircleIcon, 'text-orange-600', 'adverse')}
        </div>
      ),
      idPrefix: 'admin',
      collapsibleStateKey: 'administration',
    },
  ];


  return (
    <div className="space-y-4 sm:space-y-5">
      {sections.map((section) => {
        if (!section.data || section.data.length === 0) return null;
        const isOpen = openSections[section.collapsibleStateKey];
        return (
          <Collapsible key={section.title} open={isOpen} onOpenChange={() => toggleSection(section.collapsibleStateKey)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between p-3 sm:p-4 h-auto bg-card border-border shadow-sm hover:bg-accent transition-all duration-200 rounded-lg",
                  isOpen && "bg-accent"
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={cn("p-1.5 sm:p-2 rounded-md flex-shrink-0", section.bgColorClass)}>
                    <section.icon className={cn("h-4 w-4 sm:h-5 sm:w-5", section.iconColorClass)} />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-foreground text-left">
                    {section.title}
                  </span>
                </div>
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent">
              {/* Using Card for consistent styling of content area */}
              <Card className="mt-2 sm:mt-3 border-border shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  {section.data.map((item, index) => section.renderContent(item, index))}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};
