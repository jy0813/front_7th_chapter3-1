import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/inputs/button';
import { Alert } from '@/components/feedback/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '@/components/feedback/dialog';
import { Input } from '@/components/inputs/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/inputs/form';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/inputs/native-select';
import { Textarea } from '@/components/inputs/textarea';
import type { User } from '../../../services/userService';
import type { Post } from '../../../services/postService';
import type { EntityType } from '@/hooks/useManagementTab';

type Entity = User | Post;

type FormData = {
  // user fields
  username?: string;
  email?: string;
  role?: 'user' | 'moderator' | 'admin';

  // post fields
  title?: string;
  author?: string;
  category?: 'development' | 'design' | 'accessibility';
  content?: string;

  // shared field
  status?: string;
};

interface ManagementDialogProps {
  mode: 'create' | 'edit';
  entityType: EntityType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem?: Entity | null;
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function ManagementDialog({
  mode,
  entityType,
  open,
  onOpenChange,
  selectedItem,
  form,
  onSubmit,
  onCancel,
}: ManagementDialogProps) {
  const isEditMode = mode === 'edit';
  const entityLabel = entityType === 'user' ? '사용자' : '게시글';

  // Form validation state
  const { isSubmitting } = form.formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? `${entityLabel} 수정` : `새 ${entityLabel} 만들기`}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `${entityLabel} 정보를 수정하세요.`
              : entityType === 'user'
                ? '새로운 사용자 정보를 입력하세요.'
                : '새로운 게시글 정보를 입력하세요.'}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          {isEditMode && selectedItem && (
            <Alert variant="info" showIcon={false} className="mb-4">
              ID: {selectedItem.id} | 생성일: {selectedItem.createdAt}
              {entityType === 'post' &&
                ` | 조회수: ${(selectedItem as Post).views}`}
            </Alert>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {entityType === 'user' ? (
                <>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          사용자명 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="사용자명을 입력하세요"
                            fieldWidth="full"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          이메일 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="이메일을 입력하세요"
                            fieldWidth="full"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>역할</FormLabel>
                          <FormControl>
                            <NativeSelect fieldWidth="full" {...field}>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>상태</FormLabel>
                          <FormControl>
                            <NativeSelect fieldWidth="full" {...field}>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          제목 <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="게시글 제목을 입력하세요"
                            fieldWidth="full"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            작성자 <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="작성자명"
                              fieldWidth="full"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            카테고리 <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <NativeSelect fieldWidth="full" required {...field}>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>내용</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="게시글 내용을 입력하세요"
                            rows={6}
                            fieldWidth="full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEditMode ? '수정 완료' : '생성'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
