import { z } from 'zod';

/**
 * User 생성 시 validation 스키마
 * - username: 3-20자, 영문/숫자/언더스코어만 허용
 * - email: 이메일 형식 검증
 * - role: 기본값 'user'
 * - status: 기본값 'active'
 */
export const userCreateSchema = z.object({
  username: z
    .string()
    .min(3, '사용자명은 최소 3글자 이상이어야 합니다')
    .max(20, '사용자명은 최대 20글자까지 가능합니다')
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다',
    }),
  email: z.string().email({
    message: '올바른 이메일 형식이 아닙니다',
  }),
  role: z.enum(['admin', 'moderator', 'user']).default('user'),
  status: z.enum(['active', 'inactive', 'suspended']).default('active'),
  lastLogin: z.string().optional(),
});

/**
 * User 수정 시 validation 스키마
 * - 모든 필드 선택적 (partial)
 */
export const userUpdateSchema = userCreateSchema.partial();
