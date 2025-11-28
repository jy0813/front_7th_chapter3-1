import { StatCard } from '@/components/data-display/stat-card';
import type { User } from '../../../services/userService';
import type { Post } from '../../../services/postService';
import type { EntityType } from '@/hooks/useManagementTab';

type Entity = User | Post;

interface ManagementStatsProps {
  entityType: EntityType;
  data: Entity[];
}

export function ManagementStats({ entityType, data }: ManagementStatsProps) {
  const getStats = () => {
    if (entityType === 'user') {
      const users = data as User[];
      return {
        total: users.length,
        stat1: {
          label: '활성',
          value: users.filter((u) => u.status === 'active').length,
        },
        stat2: {
          label: '비활성',
          value: users.filter((u) => u.status === 'inactive').length,
        },
        stat3: {
          label: '정지',
          value: users.filter((u) => u.status === 'suspended').length,
        },
        stat4: {
          label: '관리자',
          value: users.filter((u) => u.role === 'admin').length,
        },
      };
    } else {
      const posts = data as Post[];
      const totalViews = posts.reduce((sum, p) => {
        const views = Number(p.views);
        return sum + (isNaN(views) ? 0 : views);
      }, 0);

      return {
        total: posts.length,
        stat1: {
          label: '게시됨',
          value: posts.filter((p) => p.status === 'published').length,
        },
        stat2: {
          label: '임시저장',
          value: posts.filter((p) => p.status === 'draft').length,
        },
        stat3: {
          label: '보관됨',
          value: posts.filter((p) => p.status === 'archived').length,
        },
        stat4: {
          label: '총 조회수',
          value: totalViews,
        },
      };
    }
  };

  const stats = getStats();

  return (
    <div className="mb-12 grid grid-cols-5 gap-2.5">
      <StatCard variant="primary" label="전체" value={stats.total} />
      <StatCard
        variant="success"
        label={stats.stat1.label}
        value={stats.stat1.value}
      />
      <StatCard
        variant="warning"
        label={stats.stat2.label}
        value={stats.stat2.value}
      />
      <StatCard
        variant="destructive"
        label={stats.stat3.label}
        value={stats.stat3.value}
      />
      <StatCard
        variant="neutral"
        label={stats.stat4.label}
        value={stats.stat4.value}
      />
    </div>
  );
}
