import { z } from 'zod';

/**
 * Post 생성 시 validation 스키마
 * - title: 최소 5글자 (비즈니스 로직 반영)
 * - content: 선택적, 기본값 빈 문자열
 * - author: 최소 2글자
 * - category: development, design, accessibility 중 선택
 * - status: 기본값 'draft'
 */
export const postCreateSchema = z.object({
  title: z
    .string()
    .min(5, '제목은 최소 5글자 이상이어야 합니다')
    .max(100, '제목은 최대 100글자까지 가능합니다'),
  author: z
    .string()
    .min(2, '작성자명은 최소 2글자 이상이어야 합니다')
    .max(50, '작성자명은 최대 50글자까지 가능합니다'),
  category: z.enum(['development', 'design', 'accessibility'], {
    message: '유효한 카테고리를 선택해주세요',
  }),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

/**
 * Post 수정 시 validation 스키마
 * - 모든 필드 선택적 (partial)
 */
export const postUpdateSchema = postCreateSchema.partial();
