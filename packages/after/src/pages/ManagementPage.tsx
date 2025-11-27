import React, { useState, useEffect } from 'react';
import { Button } from '@/components/inputs/button';
import { Badge } from '@/components/data-display/badge';
import { Alert } from '@/components/feedback/alert';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/data-display/table';
import { StatCard } from '@/components/data-display/stat-card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogBody,
} from '@/components/feedback/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/navigation/tabs';
import { Card, CardContent } from '@/components/surfaces/card';
import { Input } from '@/components/inputs/input';
import { Label } from '@/components/inputs/label';
import { FormItem } from '@/components/inputs/form';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/inputs/native-select';
import { Textarea } from '@/components/inputs/textarea';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';

type EntityType = 'user' | 'post';
type Entity = User | Post;

export const ManagementPage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>('post');
  const [data, setData] = useState<Entity[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Entity | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
    setFormData({});
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedItem(null);
  }, [entityType]);

  const loadData = async () => {
    try {
      let result: Entity[];

      if (entityType === 'user') {
        result = await userService.getAll();
      } else {
        result = await postService.getAll();
      }

      setData(result);
    } catch (error: any) {
      setErrorMessage('데이터를 불러오는데 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleCreate = async () => {
    try {
      if (entityType === 'user') {
        await userService.create({
          username: formData.username,
          email: formData.email,
          role: formData.role || 'user',
          status: formData.status || 'active',
        });
      } else {
        await postService.create({
          title: formData.title,
          content: formData.content || '',
          author: formData.author,
          category: formData.category,
          status: formData.status || 'draft',
        });
      }

      await loadData();
      setIsCreateModalOpen(false);
      setFormData({});
      setAlertMessage(
        `${entityType === 'user' ? '사용자' : '게시글'}가 생성되었습니다`,
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '생성에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleEdit = (item: Entity) => {
    setSelectedItem(item);

    if (entityType === 'user') {
      const user = item as User;
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      const post = item as Post;
      setFormData({
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        status: post.status,
      });
    }

    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      if (entityType === 'user') {
        await userService.update(selectedItem.id, formData);
      } else {
        await postService.update(selectedItem.id, formData);
      }

      await loadData();
      setIsEditModalOpen(false);
      setFormData({});
      setSelectedItem(null);
      setAlertMessage(
        `${entityType === 'user' ? '사용자' : '게시글'}가 수정되었습니다`,
      );
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '수정에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      if (entityType === 'user') {
        await userService.delete(id);
      } else {
        await postService.delete(id);
      }

      await loadData();
      setAlertMessage('삭제되었습니다');
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '삭제에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

  const handleStatusAction = async (
    id: number,
    action: 'publish' | 'archive' | 'restore',
  ) => {
    if (entityType !== 'post') return;

    try {
      if (action === 'publish') {
        await postService.publish(id);
      } else if (action === 'archive') {
        await postService.archive(id);
      } else if (action === 'restore') {
        await postService.restore(id);
      }

      await loadData();
      const message =
        action === 'publish' ? '게시' : action === 'archive' ? '보관' : '복원';
      setAlertMessage(`${message}되었습니다`);
      setShowSuccessAlert(true);
    } catch (error: any) {
      setErrorMessage(error.message || '작업에 실패했습니다');
      setShowErrorAlert(true);
    }
  };

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
          value: posts.reduce((sum, p) => sum + p.views, 0),
        },
      };
    }
  };

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

  const renderCellContent = (item: Entity, columnKey: string) => {
    const value = (item as any)[columnKey];

    // Status column
    if (columnKey === 'status') {
      return (
        <Badge variant={getStatusBadgeVariant(value)}>
          {getStatusLabel(value)}
        </Badge>
      );
    }

    // Role column for users
    if (columnKey === 'role') {
      const roleLabels: Record<string, string> = {
        admin: '관리자',
        moderator: '운영자',
        user: '사용자',
      };
      return roleLabels[value] || value;
    }

    // Category column for posts
    if (columnKey === 'category') {
      const categoryLabels: Record<string, string> = {
        development: 'Development',
        design: 'Design',
        accessibility: 'Accessibility',
      };

      // Before 코드와 동일한 색상 매핑
      const categoryVariant =
        value === 'development'
          ? 'primary'
          : value === 'design'
            ? 'info'
            : value === 'accessibility'
              ? 'destructive'
              : 'secondary';

      return (
        <Badge variant={categoryVariant as any} pill>
          {categoryLabels[value] || value}
        </Badge>
      );
    }

    // Actions column
    if (columnKey === 'actions') {
      if (entityType === 'user') {
        return (
          <div className="flex gap-8">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(item)}
            >
              수정
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              삭제
            </Button>
          </div>
        );
      } else {
        const post = item as Post;
        return (
          <div className="flex flex-wrap gap-8">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleEdit(item)}
            >
              수정
            </Button>
            {post.status === 'draft' && (
              <Button
                variant="success"
                size="sm"
                onClick={() => handleStatusAction(item.id, 'publish')}
              >
                게시
              </Button>
            )}
            {post.status === 'published' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleStatusAction(item.id, 'archive')}
              >
                보관
              </Button>
            )}
            {post.status === 'archived' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStatusAction(item.id, 'restore')}
              >
                복원
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(item.id)}
            >
              삭제
            </Button>
          </div>
        );
      }
    }

    return value;
  };

  const stats = getStats();
  const columns = renderTableColumns();

  return (
    <>
      <div className="mx-auto max-w-[1200px] p-5">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className="text-foreground mb-1.5 text-2xl font-bold">
            관리 시스템
          </h1>
          <p className="text-foreground-muted text-sm">
            사용자와 게시글을 관리하세요
          </p>
        </div>

        {/* Main Content Card */}
        <Card>
          <CardContent className="p-2.5">
            <Tabs
              value={entityType}
              onValueChange={(value) => setEntityType(value as EntityType)}
            >
              <TabsList>
                <TabsTrigger value="post">게시글</TabsTrigger>
                <TabsTrigger value="user">사용자</TabsTrigger>
              </TabsList>

              <TabsContent value={entityType} className="mt-8">
                {/* Action Button */}
                <div className="mb-8 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    새로 만들기
                  </Button>
                </div>

                {/* Alerts */}
                {showSuccessAlert && (
                  <div className="mb-2.5">
                    <Alert
                      variant="success"
                      title="성공"
                      onClose={() => setShowSuccessAlert(false)}
                    >
                      {alertMessage}
                    </Alert>
                  </div>
                )}

                {showErrorAlert && (
                  <div className="mb-2.5">
                    <Alert
                      variant="error"
                      title="오류"
                      onClose={() => setShowErrorAlert(false)}
                    >
                      {errorMessage}
                    </Alert>
                  </div>
                )}

                {/* Statistics Cards */}
                <div className="mb-12 grid grid-cols-5 gap-2.5">
                  <StatCard
                    variant="primary"
                    label="전체"
                    value={stats.total}
                  />
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

                {/* Data Table */}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>
              새 {entityType === 'user' ? '사용자' : '게시글'} 만들기
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-16">
              {entityType === 'user' ? (
                <>
                  <FormItem>
                    <Label htmlFor="username">사용자명 *</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="사용자명을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <FormItem>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="이메일을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <div className="grid grid-cols-2 gap-16">
                    <FormItem>
                      <Label htmlFor="role">역할</Label>
                      <NativeSelect
                        id="role"
                        name="role"
                        value={formData.role || 'user'}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="user">
                          사용자
                        </NativeSelectOption>
                        <NativeSelectOption value="moderator">
                          운영자
                        </NativeSelectOption>
                        <NativeSelectOption value="admin">
                          관리자
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="status">상태</Label>
                      <NativeSelect
                        id="status"
                        name="status"
                        value={formData.status || 'active'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="active">
                          활성
                        </NativeSelectOption>
                        <NativeSelectOption value="inactive">
                          비활성
                        </NativeSelectOption>
                        <NativeSelectOption value="suspended">
                          정지
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                  </div>
                </>
              ) : (
                <>
                  <FormItem>
                    <Label htmlFor="title">제목 *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="게시글 제목을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <div className="grid grid-cols-2 gap-16">
                    <FormItem>
                      <Label htmlFor="author">작성자 *</Label>
                      <Input
                        id="author"
                        name="author"
                        value={formData.author || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        placeholder="작성자명"
                        fieldWidth="full"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="category">카테고리</Label>
                      <NativeSelect
                        id="category"
                        name="category"
                        value={formData.category || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="">
                          카테고리 선택
                        </NativeSelectOption>
                        <NativeSelectOption value="development">
                          Development
                        </NativeSelectOption>
                        <NativeSelectOption value="design">
                          Design
                        </NativeSelectOption>
                        <NativeSelectOption value="accessibility">
                          Accessibility
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                  </div>
                  <FormItem>
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="게시글 내용을 입력하세요"
                      rows={6}
                      fieldWidth="full"
                    />
                  </FormItem>
                </>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({});
              }}
            >
              취소
            </Button>
            <Button variant="primary" size="md" onClick={handleCreate}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>
              {entityType === 'user' ? '사용자' : '게시글'} 수정
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-16">
              {selectedItem && (
                <Alert variant="info" showIcon={false}>
                  ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
                  {entityType === 'post' &&
                    ` | 조회수: ${(selectedItem as Post).views}`}
                </Alert>
              )}

              {entityType === 'user' ? (
                <>
                  <FormItem>
                    <Label htmlFor="edit-username">사용자명 *</Label>
                    <Input
                      id="edit-username"
                      name="username"
                      value={formData.username || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="사용자명을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <FormItem>
                    <Label htmlFor="edit-email">이메일 *</Label>
                    <Input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="이메일을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <div className="grid grid-cols-2 gap-16">
                    <FormItem>
                      <Label htmlFor="edit-role">역할</Label>
                      <NativeSelect
                        id="edit-role"
                        name="role"
                        value={formData.role || 'user'}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="user">
                          사용자
                        </NativeSelectOption>
                        <NativeSelectOption value="moderator">
                          운영자
                        </NativeSelectOption>
                        <NativeSelectOption value="admin">
                          관리자
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="edit-status">상태</Label>
                      <NativeSelect
                        id="edit-status"
                        name="status"
                        value={formData.status || 'active'}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="active">
                          활성
                        </NativeSelectOption>
                        <NativeSelectOption value="inactive">
                          비활성
                        </NativeSelectOption>
                        <NativeSelectOption value="suspended">
                          정지
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                  </div>
                </>
              ) : (
                <>
                  <FormItem>
                    <Label htmlFor="edit-title">제목 *</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="게시글 제목을 입력하세요"
                      fieldWidth="full"
                    />
                  </FormItem>
                  <div className="grid grid-cols-2 gap-16">
                    <FormItem>
                      <Label htmlFor="edit-author">작성자 *</Label>
                      <Input
                        id="edit-author"
                        name="author"
                        value={formData.author || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        placeholder="작성자명"
                        fieldWidth="full"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor="edit-category">카테고리</Label>
                      <NativeSelect
                        id="edit-category"
                        name="category"
                        value={formData.category || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        fieldWidth="full"
                      >
                        <NativeSelectOption value="">
                          카테고리 선택
                        </NativeSelectOption>
                        <NativeSelectOption value="development">
                          Development
                        </NativeSelectOption>
                        <NativeSelectOption value="design">
                          Design
                        </NativeSelectOption>
                        <NativeSelectOption value="accessibility">
                          Accessibility
                        </NativeSelectOption>
                      </NativeSelect>
                    </FormItem>
                  </div>
                  <FormItem>
                    <Label htmlFor="edit-content">내용</Label>
                    <Textarea
                      id="edit-content"
                      name="content"
                      value={formData.content || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="게시글 내용을 입력하세요"
                      rows={6}
                      fieldWidth="full"
                    />
                  </FormItem>
                </>
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setIsEditModalOpen(false);
                setFormData({});
                setSelectedItem(null);
              }}
            >
              취소
            </Button>
            <Button variant="primary" size="md" onClick={handleUpdate}>
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
