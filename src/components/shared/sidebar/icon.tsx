import { FC } from 'react';

import {
  Circle,
  FileText,
  LayoutDashboard,
  Settings,
  User,
  Users,
} from 'lucide-react';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  FileText: FileText,
  Settings: Settings,
  User: User,
};

// Dynamic icon component that renders icons by name
export const DynamicIcon: FC<{ name: string; className?: string }> = ({
  name,
  className,
}) => {
  const Icon = iconMap[name] || Circle;
  return <Icon className={className} />;
};
