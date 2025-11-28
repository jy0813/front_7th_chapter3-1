import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/data-display/table';
import { Badge } from '@/components/data-display/badge';
import { Button } from '@/components/inputs/button';
import type { User } from '../../../services/userService';
import type { Post } from '../../../services/postService';
import type { EntityType } from '@/hooks/useManagementTab';

type Entity = User | Post;

interface ManagementTableProps {
  entityType: EntityType;
  data: Entity[];
  onEdit: (item: Entity) => void;
  onDelete: (id: number) => void;
  onStatusAction: (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => void;
}

export function ManagementTable({
  entityType,
  data,
  onEdit,
  onDelete,
  onStatusAction,
}: ManagementTableProps) {
  const renderTableColumns = () => {
    if (entityType === 'user') {
      return [
        { key: 'id', header: 'ID', width: '60px' },
        { key: 'username', header: '사용자명', width: '150px' },
        { key: 'email', header: '이메일' },
        { key: 'role', header: '역할', width: '120px' },
        { key: 'status', header: '상태', width: '120px' },
        { key: 'createdAt', header: '생성일', width: '120px' },
        { key: 'lastLogin', header: '마지막 로그인', width: '140px' },
        { key: 'actions', header: '관리', width: '200px' },
      ];
    } else {
      return [
        { key: 'id', header: 'ID', width: '60px' },
        { key: 'title', header: '제목' },
        { key: 'author', header: '작성자', width: '120px' },
        { key: 'category', header: '카테고리', width: '140px' },
        { key: 'status', header: '상태', width: '120px' },
        { key: 'views', header: '조회수', width: '100px' },
        { key: 'createdAt', header: '작성일', width: '120px' },
        { key: 'actions', header: '관리', width: '250px' },
      ];
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    if (entityType === 'user') {
      switch (status) {
        case 'active':
          return 'success';
        case 'inactive':
          return 'warning';
        case 'suspended':
          return 'destructive';
        default:
          return 'secondary';
      }
    } else {
      switch (status) {
        case 'published':
          return 'success';
        case 'draft':
          return 'warning';
        case 'archived':
          return 'secondary';
        default:
          return 'secondary';
      }
    }
  };

  const getStatusLabel = (status: string) => {
    if (entityType === 'user') {
      switch (status) {
        case 'active':
          return '활성';
        case 'inactive':
          return '비활성';
        case 'suspended':
          return '정지';
        default:
          return status;
      }
    } else {
      switch (status) {
        case 'published':
          return '게시됨';
        case 'draft':
          return '임시저장';
        case 'archived':
          return '보관됨';
        default:
          return status;
      }
    }
  };

  const renderCellContent = (item: Entity, columnKey: string): React.ReactNode => {
    const value = (item as unknown as Record<string, unknown>)[columnKey];

    if (columnKey === 'status') {
      return (
        <Badge variant={getStatusBadgeVariant(value as string)}>
          {getStatusLabel(value as string)}
        </Badge>
      );
    }

    if (columnKey === 'role') {
      const roleLabels: Record<string, string> = {
        admin: '관리자',
        moderator: '운영자',
        user: '사용자',
      };

      const roleVariant =
        value === 'admin'
          ? 'destructive'
          : value === 'moderator'
            ? 'warning'
            : 'secondary';

      return (
        <Badge
          variant={roleVariant as 'destructive' | 'warning' | 'secondary'}
          pill
        >
          {roleLabels[value as string] || String(value)}
        </Badge>
      );
    }

    if (columnKey === 'category') {
      const categoryLabels: Record<string, string> = {
        development: 'Development',
        design: 'Design',
        accessibility: 'Accessibility',
      };

      const categoryVariant =
        value === 'development'
          ? 'primary'
          : value === 'design'
            ? 'info'
            : value === 'accessibility'
              ? 'destructive'
              : 'secondary';

      return (
        <Badge
          variant={
            categoryVariant as 'primary' | 'info' | 'destructive' | 'secondary'
          }
          pill
        >
          {categoryLabels[value as string] || String(value)}
        </Badge>
      );
    }

    if (columnKey === 'actions') {
      if (entityType === 'user') {
        return (
          <div className="flex gap-8">
            <Button variant="primary" size="sm" onClick={() => onEdit(item)}>
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              삭제
            </Button>
          </div>
        );
      } else {
        const post = item as Post;
        return (
          <div className="flex flex-wrap gap-8">
            <Button variant="primary" size="sm" onClick={() => onEdit(item)}>
              수정
            </Button>
            {post.status === 'draft' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => onStatusAction(item.id, 'publish')}
              >
                게시
              </Button>
            )}
            {post.status === 'published' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onStatusAction(item.id, 'archive')}
              >
                보관
              </Button>
            )}
            {post.status === 'archived' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onStatusAction(item.id, 'restore')}
              >
                복원
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              삭제
            </Button>
          </div>
        );
      }
    }

    return String(value);
  };

  const columns = renderTableColumns();

  return (
    <div className="border-border bg-background overflow-auto border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} style={{ width: col.width }}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} striped hoverable>
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {renderCellContent(item, col.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
