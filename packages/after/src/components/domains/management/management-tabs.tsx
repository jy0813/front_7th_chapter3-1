import { Tabs, TabsList, TabsTrigger } from '@/components/navigation/tabs';
import type { EntityType } from '@/hooks/useManagementTab';

interface EntityTypeTabsProps {
  value: EntityType;
  onValueChange: (value: string) => void;
  children?: React.ReactNode;
}

export function EntityTypeTabs({
  value,
  onValueChange,
  children,
}: EntityTypeTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList>
        <TabsTrigger value="post">게시글</TabsTrigger>
        <TabsTrigger value="user">사용자</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
