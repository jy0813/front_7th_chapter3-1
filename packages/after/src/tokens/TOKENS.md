# Design Token System Documentation

Tailwind CSS v4 기반 디자인 토큰 시스템 완벽 가이드

---

## 목차

1. [시스템 개요](#시스템-개요)
2. [Tailwind CSS v4 핵심 개념](#tailwind-css-v4-핵심-개념)
3. [토큰 체이닝 아키텍처](#토큰-체이닝-아키텍처)
4. [Tailwind v4 네임스페이스 규칙](#tailwind-v4-네임스페이스-규칙)
5. [Primitive Tokens](#primitive-tokens)
6. [Semantic Tokens](#semantic-tokens)
7. [Component Tokens](#component-tokens)
8. [다크 모드](#다크-모드)
9. [사용 예시](#사용-예시)
10. [shadcn/ui 통합](#shadcnui-통합)
11. [마이그레이션 가이드](#마이그레이션-가이드)

---

## 시스템 개요

### 토큰 계층 구조

```
┌─────────────────────────────────────────────────────────────┐
│                    Primitive Tokens                         │
│              (순수 값: #ffffff, 8px, 400 등)                 │
│                      @theme { }                             │
└──────────────────────────┬──────────────────────────────────┘
                           │ 참조
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Semantic Tokens                          │
│          (의미 기반: primary, background, border 등)         │
│                   @theme inline { }                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ 참조
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Component Tokens                          │
│           (컴포넌트별: btn-primary-bg, card-border 등)       │
│                   @theme inline { }                         │
└─────────────────────────────────────────────────────────────┘
```

### 파일 구조

```
src/tokens/
├── index.css         # 진입점 (이 파일만 import)
├── primitive.css     # Primitive 토큰 (@theme) + 동적 변수 (:root/.dark)
├── semantic.css      # Semantic 토큰 (@theme inline)
├── components.css    # Component 토큰 (@theme inline)
└── TOKENS.md         # 이 문서
```

### 사용법

```tsx
// App.tsx 또는 main.tsx
import '@/tokens/index.css';
```

---

## Tailwind CSS v4 핵심 개념

### 제로 런타임(Zero Runtime)이란?

Tailwind CSS는 **제로 런타임** 프레임워크입니다.

```
CSS-in-JS (styled-components, emotion)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
브라우저 로드 → JS 실행 → 스타일 생성 → DOM 주입
                 ↑
            런타임 비용 발생 (JS 번들 + 실행 시간)


Tailwind CSS (제로 런타임)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
빌드 시 → 정적 CSS 파일 생성
브라우저 로드 → CSS 파일 적용 (끝)
                 ↑
            JS 실행 없음 = 제로 런타임
```

**핵심 포인트:**
- **제로 런타임** = 브라우저에서 JavaScript가 스타일을 생성하지 않음
- **CSS 변수**(`var(--something)`)는 CSS의 네이티브 기능이므로 런타임과 무관
- 두 개념은 충돌하지 않음 → Tailwind는 제로 런타임이면서 CSS 변수 기반 다크모드 지원

---

### @theme vs @theme inline

Tailwind CSS v4에서 가장 중요한 두 가지 지시어입니다.

#### @theme (표준)

`@theme` 안에 정의된 변수는 Tailwind가 유틸리티 클래스를 생성하고, **변수명 자체**를 참조합니다.

```css
@theme {
  --color-primary: #1976d2;
}
```

**컴파일 결과:**
```css
:root {
  --color-primary: #1976d2;
}

.bg-primary {
  background: var(--color-primary);  /* 변수명 참조 */
}
```

#### @theme inline

`@theme inline` 안에 정의된 변수는 **정의한 값**을 직접 인라인합니다.

```css
@theme inline {
  --color-background: var(--raw-background);
}
```

**컴파일 결과:**
```css
/* :root에 --color-background 생성 안 됨! */

.bg-background {
  background: var(--raw-background);  /* 값이 인라인됨 */
}
```

#### 핵심 차이점 비교

| 구분 | `@theme` | `@theme inline` |
|------|----------|-----------------|
| CSS 변수 생성 | `:root`에 생성됨 | 생성 안 됨 |
| 유틸리티 출력 | `var(--변수명)` | 정의한 값 그대로 |
| 용도 | 정적 값 정의 | 다른 변수 참조 시 |
| 다크모드 | 변수 재정의 필요 | 참조하는 원본 변수만 변경 |

#### 그림으로 이해하기

```
@theme (변수명 참조)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
정의: --color-background: var(--raw-background)
                              │
출력: .bg-background { background: var(--color-background) }
                                         ↑
                               중간 변수를 참조 (문제 발생 가능)


@theme inline (값 직접 사용)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
정의: --color-background: var(--raw-background)
                              │
출력: .bg-background { background: var(--raw-background) }
                                         ↑
                               값이 직접 인라인됨 (다크모드 작동!)
```

---

### :root와 동적 변수

#### 정적 변수 vs 동적 변수

| 구분 | 정의 위치 | Tailwind 처리 | 런타임 변경 |
|------|----------|---------------|-------------|
| **정적 변수** | `@theme { }` 안 | 컴파일 시 처리 | 불가능 |
| **동적 변수** | `@theme` 바깥 (`:root`, `.dark`) | 그대로 출력 | 가능 |

#### 왜 :root가 필요한가?

다크모드처럼 **런타임에 값이 변경**되어야 하는 경우, `@theme` 바깥에서 정의해야 합니다.

```css
/* primitive.css */

/* 정적 변수 - Tailwind가 컴파일 시 처리 */
@theme {
  --color-white: #ffffff;
  --color-gray-800: #333333;
}

/* 동적 변수 - 런타임에 변경 가능 */
:root {
  --raw-background: var(--color-white);
}

.dark {
  --raw-background: var(--color-gray-800);
}
```

```css
/* semantic.css */
@theme inline {
  --color-background: var(--raw-background);
}
```

**컴파일 결과:**
```css
.bg-background {
  background: var(--raw-background);
}
```

`.dark` 클래스가 적용되면 `--raw-background` 값이 변경되어 다크모드가 작동합니다.

---

### @theme에서 var() 참조 시 문제점

`@theme`에서 다른 CSS 변수를 참조하면 **스코프 문제**가 발생합니다.

```css
/* 문제가 되는 패턴 */
@theme {
  --color-background: var(--raw-background);
}

/* 출력 */
:root {
  --color-background: var(--raw-background);
}

.bg-background {
  background: var(--color-background);  /* 중간 변수 참조 */
}
```

**문제:**
```
.bg-background → var(--color-background) 해석
                 ↓
--color-background → :root에서 정의됨 → var(--raw-background)
                     ↓
var(--raw-background) → :root 스코프에서 해석 (white)
                        ↑
                   .dark 스코프가 아님!
```

CSS 변수는 **정의된 위치**에서 해석되므로, `.dark`의 변경이 반영되지 않습니다.

**해결책: @theme inline 사용**
```css
@theme inline {
  --color-background: var(--raw-background);
}

/* 출력 - 중간 변수 없이 직접 참조 */
.bg-background {
  background: var(--raw-background);
}
```

---

## 토큰 체이닝 아키텍처

### 전체 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                      primitive.css                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @theme {                                                       │
│    --color-white: #ffffff;      ← 정적 값                       │
│    --color-gray-800: #333333;                                   │
│  }                                                              │
│                                                                 │
│  :root {                                                        │
│    --raw-background: var(--color-white);    ← 동적 변수 (Light) │
│  }                                                              │
│                                                                 │
│  .dark {                                                        │
│    --raw-background: var(--color-gray-800); ← 동적 변수 (Dark)  │
│  }                                                              │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      semantic.css                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @theme inline {                                                │
│    --color-background: var(--raw-background);                   │
│  }                     ↑                                        │
│                        │                                        │
│                   동적 변수 참조 → 다크모드 자동 적용              │
│                                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     components.css                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  @theme inline {                                                │
│    --color-card-bg: var(--color-background);                    │
│  }                     ↑                                        │
│                        │                                        │
│                   semantic 토큰 참조                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 빌드 타임 vs 런타임

```
빌드 타임 (Tailwind 컴파일)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
@theme { --color-white: #fff }
@theme inline { --color-background: var(--raw-background) }
                        │
                        ▼
.bg-background { background: var(--raw-background) }
                        │
                정적 CSS 파일 생성 (JS 없음)


브라우저 런타임 (CSS cascade)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
:root { --raw-background: white }    ← 기본값
.dark { --raw-background: black }    ← 오버라이드

<body class="dark">
  └─ --raw-background = black (CSS cascade)
     └─ .bg-background → background: black
```

---

## Tailwind v4 네임스페이스 규칙

Tailwind CSS v4에서는 CSS 변수의 **네임스페이스**가 자동으로 유틸리티 클래스를 생성합니다.

### 핵심 네임스페이스 매핑

| CSS 변수 네임스페이스 | 생성되는 Tailwind 클래스 | 예시 |
|---------------------|------------------------|------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` | `--color-primary` → `bg-primary`, `text-primary` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*`, `inset-*` | `--spacing-btn-md` → `p-btn-md`, `m-btn-md`, `gap-btn-md` |
| `--text-*` | `text-*` (font-size) | `--text-xl` → `text-xl` |
| `--font-*` | `font-*` (font-weight) | `--font-bold` → `font-bold` |
| `--leading-*` | `leading-*` (line-height) | `--leading-relaxed` → `leading-relaxed` |
| `--tracking-*` | `tracking-*` (letter-spacing) | `--tracking-wide` → `tracking-wide` |
| `--radius-*` | `rounded-*` | `--radius-btn` → `rounded-btn` |
| `--shadow-*` | `shadow-*` | `--shadow-card` → `shadow-card` |
| `--z-*` | `z-*` | `--z-modal` → `z-modal` |
| `--opacity-*` | `opacity-*` | `--opacity-disabled` → `opacity-disabled` |
| `--size-*` | `size-*` (width + height 동시) | `--size-checkbox` → `size-checkbox` |
| `--duration-*` | `duration-*` | `--duration-fast` → `duration-fast` |

### Spacing 클래스 자동 생성

`--spacing-*` 토큰 하나가 **모든 방향의 클래스**를 생성합니다:

```css
--spacing-btn-md: 8px;
```

생성되는 클래스:
- `p-btn-md` (padding: 8px)
- `py-btn-md` (padding-top/bottom: 8px)
- `px-btn-md` (padding-left/right: 8px)
- `pt-btn-md`, `pb-btn-md`, `pl-btn-md`, `pr-btn-md`
- `m-btn-md`, `my-btn-md`, `mx-btn-md`, `mt-btn-md`, ...
- `gap-btn-md`, `gap-x-btn-md`, `gap-y-btn-md`
- `w-btn-md`, `h-btn-md`
- `inset-btn-md`, `top-btn-md`, `right-btn-md`, ...

---

## Primitive Tokens

순수 값만 정의하며 의미(semantic)를 포함하지 않습니다.

### 정적 토큰 (@theme)

#### Colors - Solid

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-white` | `#ffffff` | `bg-white`, `text-white`, `border-white` |
| `--color-black` | `#000000` | `bg-black`, `text-black`, `border-black` |

##### Gray Scale

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-gray-50` | `#fafafa` | `bg-gray-50`, `text-gray-50` |
| `--color-gray-100` | `#f5f5f5` | `bg-gray-100`, `text-gray-100` |
| `--color-gray-200` | `#e0e0e0` | `bg-gray-200`, `text-gray-200` |
| `--color-gray-300` | `#d1d5db` | `bg-gray-300`, `text-gray-300` |
| `--color-gray-350` | `#cccccc` | `bg-gray-350`, `text-gray-350` |
| `--color-gray-400` | `#bdbdbd` | `bg-gray-400`, `text-gray-400` |
| `--color-gray-500` | `#757575` | `bg-gray-500`, `text-gray-500` |
| `--color-gray-550` | `#6b7280` | `bg-gray-550`, `text-gray-550` |
| `--color-gray-600` | `#666666` | `bg-gray-600`, `text-gray-600` |
| `--color-gray-700` | `#424242` | `bg-gray-700`, `text-gray-700` |
| `--color-gray-750` | `#374151` | `bg-gray-750`, `text-gray-750` |
| `--color-gray-800` | `#333333` | `bg-gray-800`, `text-gray-800` |

##### Blue Scale

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-blue-50` | `#e3f2fd` | `bg-blue-50`, `text-blue-50` |
| `--color-blue-200` | `#90caf9` | `bg-blue-200`, `text-blue-200` |
| `--color-blue-500` | `#1976d2` | `bg-blue-500`, `text-blue-500` |
| `--color-blue-600` | `#1565c0` | `bg-blue-600`, `text-blue-600` |
| `--color-blue-700` | `#0288d1` | `bg-blue-700`, `text-blue-700` |
| `--color-blue-900` | `#0d47a1` | `bg-blue-900`, `text-blue-900` |

##### Red Scale

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-red-50` | `#ffebee` | `bg-red-50`, `text-red-50` |
| `--color-red-300` | `#e57373` | `bg-red-300`, `text-red-300` |
| `--color-red-500` | `#ef4444` | `bg-red-500`, `text-red-500` |
| `--color-red-600` | `#d32f2f` | `bg-red-600`, `text-red-600` |
| `--color-red-700` | `#c62828` | `bg-red-700`, `text-red-700` |
| `--color-red-900` | `#b71c1c` | `bg-red-900`, `text-red-900` |

##### Green Scale

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-green-50` | `#e8f5e9` | `bg-green-50`, `text-green-50` |
| `--color-green-300` | `#81c784` | `bg-green-300`, `text-green-300` |
| `--color-green-600` | `#388e3c` | `bg-green-600`, `text-green-600` |
| `--color-green-700` | `#2e7d32` | `bg-green-700`, `text-green-700` |
| `--color-green-900` | `#1b5e20` | `bg-green-900`, `text-green-900` |

##### Orange Scale

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--color-orange-50` | `#fff3e0` | `bg-orange-50`, `text-orange-50` |
| `--color-orange-300` | `#ffb74d` | `bg-orange-300`, `text-orange-300` |
| `--color-orange-600` | `#f57c00` | `bg-orange-600`, `text-orange-600` |
| `--color-orange-800` | `#e65100` | `bg-orange-800`, `text-orange-800` |

#### Colors - Alpha (투명도)

| CSS 변수 | 값 | 용도 |
|---------|-----|------|
| `--color-black-a4` | `rgba(0,0,0,0.04)` | hover overlay |
| `--color-black-a8` | `rgba(0,0,0,0.08)` | subtle border |
| `--color-black-a12` | `rgba(0,0,0,0.12)` | border |
| `--color-black-a14` | `rgba(0,0,0,0.14)` | shadow |
| `--color-black-a20` | `rgba(0,0,0,0.2)` | shadow |
| `--color-black-a23` | `rgba(0,0,0,0.23)` | input border |
| `--color-black-a50` | `rgba(0,0,0,0.5)` | overlay |
| `--color-black-a54` | `rgba(0,0,0,0.54)` | subtle text |
| `--color-black-a60` | `rgba(0,0,0,0.6)` | muted text |
| `--color-black-a87` | `rgba(0,0,0,0.87)` | primary text |

#### Spacing

| CSS 변수 | 값 | 생성 클래스 (예시) |
|---------|-----|------------------|
| `--spacing-0` | `0px` | `p-0`, `m-0`, `gap-0` |
| `--spacing-2` | `2px` | `p-2`, `m-2`, `gap-2` |
| `--spacing-4` | `4px` | `p-4`, `m-4`, `gap-4` |
| `--spacing-6` | `6px` | `p-6`, `m-6`, `gap-6` |
| `--spacing-8` | `8px` | `p-8`, `m-8`, `gap-8` |
| `--spacing-10` | `10px` | `p-10`, `m-10`, `gap-10` |
| `--spacing-12` | `12px` | `p-12`, `m-12`, `gap-12` |
| `--spacing-14` | `14px` | `p-14`, `m-14`, `gap-14` |
| `--spacing-16` | `16px` | `p-16`, `m-16`, `gap-16` |
| `--spacing-20` | `20px` | `p-20`, `m-20`, `gap-20` |
| `--spacing-24` | `24px` | `p-24`, `m-24`, `gap-24` |
| `--spacing-32` | `32px` | `p-32`, `m-32`, `gap-32` |

#### Font Size

| CSS 변수 | 값 | Semantic 토큰에서 참조 |
|---------|-----|---------------------|
| `--font-size-10` | `10px` | `--text-xs` |
| `--font-size-12` | `12px` | `--text-sm` |
| `--font-size-13` | `13px` | - |
| `--font-size-14` | `14px` | `--text-base` |
| `--font-size-15` | `15px` | `--text-md` |
| `--font-size-16` | `16px` | `--text-lg` |
| `--font-size-18` | `18px` | `--text-xl` |
| `--font-size-20` | `20px` | `--text-2xl` |
| `--font-size-28` | `28px` | `--text-3xl` |

#### Font Weight

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--font-weight-400` | `400` | `--font-normal` |
| `--font-weight-500` | `500` | `--font-medium` |
| `--font-weight-700` | `700` | `--font-bold` |

#### Line Height

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--line-height-1` | `1` | `--leading-none` |
| `--line-height-1-19` | `1.1876` | `--leading-tight` |
| `--line-height-1-4` | `1.4` | `--leading-snug` |
| `--line-height-1-43` | `1.43` | `--leading-normal` |
| `--line-height-1-5` | `1.5` | `--leading-relaxed` |
| `--line-height-1-6` | `1.6` | `--leading-loose` |

#### Letter Spacing

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--letter-spacing-wide` | `0.03em` | `--tracking-wide` |

#### Border Radius

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--radius-0` | `0px` | `--rounded-none` |
| `--radius-2` | `2px` | `--rounded-sm` |
| `--radius-3` | `3px` | `--rounded-base` |
| `--radius-4` | `4px` | `--rounded-md` |
| `--radius-10` | `10px` | `--rounded-lg` |
| `--radius-full` | `9999px` | `--rounded-full` |

#### Width

| CSS 변수 | 값 | 용도 |
|---------|-----|------|
| `--width-16` | `16px` | icon-sm |
| `--width-32` | `32px` | icon-md |
| `--width-200` | `200px` | input-sm |
| `--width-300` | `300px` | input-md |
| `--width-400` | `400px` | input-lg, modal-sm |
| `--width-600` | `600px` | modal-md |
| `--width-900` | `900px` | modal-lg |

#### Z-Index

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--z-0` | `0` | `--z-base` |
| `--z-10` | `10` | `--z-dropdown` |
| `--z-100` | `100` | `--z-sticky` |
| `--z-1000` | `1000` | `--z-modal` |

#### Opacity

| CSS 변수 | 값 | 생성 클래스 |
|---------|-----|-----------|
| `--opacity-0` | `0` | `opacity-0` |
| `--opacity-60` | `0.6` | `opacity-60` |
| `--opacity-100` | `1` | `opacity-100` |

#### Duration

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--duration-150` | `150ms` | `--duration-fast` |
| `--duration-200` | `200ms` | `--duration-normal` |
| `--duration-1400` | `1400ms` | `--duration-slow` |

#### Shadow

| CSS 변수 | 값 | Semantic 토큰 |
|---------|-----|-------------|
| `--shadow-1` | Material Design elevation 1 | `--shadow-sm` |
| `--shadow-2` | Material Design elevation 2 | `--shadow-md` |
| `--shadow-3` | Material Design elevation 3 | `--shadow-lg` |

#### Font Family

| CSS 변수 | 값 |
|---------|-----|
| `--font-sans` | `Arial, sans-serif` |
| `--font-system` | `'Roboto', 'Helvetica', 'Arial', sans-serif` |

---

### 동적 토큰 (:root / .dark)

다크모드 지원을 위한 동적 변수입니다. `@theme` 바깥에서 정의됩니다.

#### Light Mode (:root)

| CSS 변수 | 참조값 | 용도 |
|---------|-------|------|
| `--raw-background` | `--color-white` | 기본 배경 |
| `--raw-background-subtle` | `--color-gray-50` | 약간 어두운 배경 |
| `--raw-background-muted` | `--color-gray-100` | 음소거된 배경 |
| `--raw-background-disabled` | `--color-gray-100` | 비활성화 배경 |
| `--raw-foreground` | `--color-black-a87` | 기본 텍스트 |
| `--raw-foreground-muted` | `--color-black-a60` | 보조 텍스트 |
| `--raw-foreground-subtle` | `--color-black-a54` | 힌트 텍스트 |
| `--raw-border` | `--color-black-a12` | 기본 테두리 |
| `--raw-border-subtle` | `--color-black-a8` | 약한 테두리 |
| `--raw-border-input` | `--color-gray-350` | Input 테두리 |
| `--raw-input-text` | `--color-black` | Input 텍스트 |
| `--raw-label-text` | `--color-gray-800` | Label 텍스트 |
| `--raw-helper-text` | `--color-gray-600` | Helper 텍스트 |
| `--raw-checkbox-border` | `--color-gray-300` | Checkbox 테두리 |
| `--raw-checkbox-label` | `--color-gray-750` | Checkbox 라벨 |
| `--raw-checkbox-hint` | `--color-gray-550` | Checkbox 힌트 |
| `--raw-textarea-border` | `--color-black-a23` | Textarea 테두리 |
| `--raw-textarea-bg-disabled` | `--color-black-a12` | Textarea 비활성화 배경 |

#### Dark Mode (.dark)

| CSS 변수 | 참조값 | 용도 |
|---------|-------|------|
| `--raw-background` | `--color-gray-800` | 다크 배경 |
| `--raw-background-subtle` | `--color-gray-700` | 약간 밝은 배경 |
| `--raw-background-muted` | `--color-gray-700` | 음소거된 배경 |
| `--raw-background-disabled` | `--color-gray-600` | 비활성화 배경 |
| `--raw-foreground` | `--color-white` | 기본 텍스트 |
| `--raw-foreground-muted` | `--color-gray-300` | 보조 텍스트 |
| `--raw-foreground-subtle` | `--color-gray-400` | 힌트 텍스트 |
| `--raw-border` | `--color-gray-600` | 기본 테두리 |
| `--raw-border-subtle` | `--color-gray-700` | 약한 테두리 |
| `--raw-border-input` | `--color-gray-500` | Input 테두리 |
| `--raw-input-text` | `--color-white` | Input 텍스트 |
| `--raw-label-text` | `--color-gray-200` | Label 텍스트 |
| `--raw-helper-text` | `--color-gray-400` | Helper 텍스트 |
| `--raw-checkbox-border` | `--color-gray-500` | Checkbox 테두리 |
| `--raw-checkbox-label` | `--color-gray-200` | Checkbox 라벨 |
| `--raw-checkbox-hint` | `--color-gray-400` | Checkbox 힌트 |
| `--raw-textarea-border` | `--color-gray-500` | Textarea 테두리 |
| `--raw-textarea-bg-disabled` | `--color-gray-700` | Textarea 비활성화 배경 |

---

## Semantic Tokens

의미와 용도 기반으로 정의된 토큰입니다. `@theme inline`을 사용하여 동적 변수를 참조합니다.

### Colors - Intent Based

#### Primary (주요 액션, 브랜드)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-primary` | `--color-blue-500` | `bg-primary`, `text-primary`, `border-primary` |
| `--color-primary-hover` | `--color-blue-600` | `bg-primary-hover`, `text-primary-hover` |
| `--color-primary-foreground` | `--color-white` | `text-primary-foreground` |

#### Secondary (보조 액션)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-secondary` | `--color-gray-100` | `bg-secondary`, `text-secondary` |
| `--color-secondary-hover` | `--color-gray-200` | `bg-secondary-hover` |
| `--color-secondary-foreground` | `--color-gray-800` | `text-secondary-foreground` |
| `--color-secondary-border` | `--color-gray-350` | `border-secondary-border` |

#### Destructive (삭제, 위험)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-destructive` | `--color-red-600` | `bg-destructive`, `text-destructive` |
| `--color-destructive-hover` | `--color-red-700` | `bg-destructive-hover` |
| `--color-destructive-foreground` | `--color-white` | `text-destructive-foreground` |

#### Success (성공)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-success` | `--color-green-600` | `bg-success`, `text-success` |
| `--color-success-hover` | `--color-green-700` | `bg-success-hover` |
| `--color-success-foreground` | `--color-white` | `text-success-foreground` |

#### Warning (경고)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-warning` | `--color-orange-600` | `bg-warning`, `text-warning` |
| `--color-warning-foreground` | `--color-white` | `text-warning-foreground` |

#### Info (정보)

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-info` | `--color-blue-700` | `bg-info`, `text-info` |
| `--color-info-foreground` | `--color-white` | `text-info-foreground` |

### Colors - Surface (배경) - 다크모드 지원

| CSS 변수 | 참조값 | 용도 | 다크모드 |
|---------|-------|------|---------|
| `--color-background` | `--raw-background` | 기본 배경 | ✅ |
| `--color-background-subtle` | `--raw-background-subtle` | 약간 어두운 배경 | ✅ |
| `--color-background-muted` | `--raw-background-muted` | 음소거된 배경 | ✅ |
| `--color-background-disabled` | `--raw-background-disabled` | 비활성화 배경 | ✅ |

### Colors - Foreground (텍스트) - 다크모드 지원

| CSS 변수 | 참조값 | 용도 | 다크모드 |
|---------|-------|------|---------|
| `--color-foreground` | `--raw-foreground` | 기본 텍스트 | ✅ |
| `--color-foreground-muted` | `--raw-foreground-muted` | 보조 텍스트 | ✅ |
| `--color-foreground-subtle` | `--raw-foreground-subtle` | 힌트 텍스트 | ✅ |
| `--color-foreground-disabled` | `--color-gray-600` | 비활성화 텍스트 | ❌ |

### Colors - Feedback (Alert 상태)

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Info | `--color-feedback-info-bg` | `--color-feedback-info-border` | `--color-feedback-info-text` |
| Success | `--color-feedback-success-bg` | `--color-feedback-success-border` | `--color-feedback-success-text` |
| Warning | `--color-feedback-warning-bg` | `--color-feedback-warning-border` | `--color-feedback-warning-text` |
| Error | `--color-feedback-error-bg` | `--color-feedback-error-border` | `--color-feedback-error-text` |
| Default | `--color-feedback-default-bg` | `--color-feedback-default-border` | `--color-feedback-default-text` |

### Colors - Border - 다크모드 지원

| CSS 변수 | 참조값 | 용도 | 다크모드 |
|---------|-------|------|---------|
| `--color-border` | `--raw-border` | 기본 border | ✅ |
| `--color-border-subtle` | `--raw-border-subtle` | 약한 border | ✅ |
| `--color-border-input` | `--raw-border-input` | Input border | ✅ |
| `--color-border-focus` | `--color-blue-500` | Focus 상태 | ❌ |
| `--color-border-error` | `--color-red-600` | Error 상태 | ❌ |

### Colors - Form Elements - 다크모드 지원

| CSS 변수 | 참조값 | 용도 | 다크모드 |
|---------|-------|------|---------|
| `--color-input-text` | `--raw-input-text` | Input 텍스트 | ✅ |
| `--color-label-text` | `--raw-label-text` | Label 텍스트 | ✅ |
| `--color-helper-text` | `--raw-helper-text` | Helper 텍스트 | ✅ |
| `--color-checkbox-border` | `--raw-checkbox-border` | Checkbox 테두리 | ✅ |
| `--color-checkbox-label` | `--raw-checkbox-label` | Checkbox 라벨 | ✅ |
| `--color-checkbox-hint` | `--raw-checkbox-hint` | Checkbox 힌트 | ✅ |
| `--color-textarea-border` | `--raw-textarea-border` | Textarea 테두리 | ✅ |
| `--color-textarea-bg-disabled` | `--raw-textarea-bg-disabled` | Textarea 비활성화 배경 | ✅ |

### Colors - Overlay

| CSS 변수 | 참조값 | 용도 |
|---------|-------|------|
| `--color-overlay` | `--color-black-a50` | Modal overlay |
| `--color-hover-overlay` | `--color-black-a4` | Hover 효과 |

### Typography

#### Font Size Scale

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--text-xs` | `--font-size-10` | `10px` | `text-xs` |
| `--text-sm` | `--font-size-12` | `12px` | `text-sm` |
| `--text-base` | `--font-size-14` | `14px` | `text-base` |
| `--text-md` | `--font-size-15` | `15px` | `text-md` |
| `--text-lg` | `--font-size-16` | `16px` | `text-lg` |
| `--text-xl` | `--font-size-18` | `18px` | `text-xl` |
| `--text-2xl` | `--font-size-20` | `20px` | `text-2xl` |
| `--text-3xl` | `--font-size-28` | `28px` | `text-3xl` |

#### Font Weight

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--font-normal` | `--font-weight-400` | `400` | `font-normal` |
| `--font-medium` | `--font-weight-500` | `500` | `font-medium` |
| `--font-bold` | `--font-weight-700` | `700` | `font-bold` |

#### Line Height

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--leading-none` | `--line-height-1` | `1` | `leading-none` |
| `--leading-tight` | `--line-height-1-19` | `1.1876` | `leading-tight` |
| `--leading-snug` | `--line-height-1-4` | `1.4` | `leading-snug` |
| `--leading-normal` | `--line-height-1-43` | `1.43` | `leading-normal` |
| `--leading-relaxed` | `--line-height-1-5` | `1.5` | `leading-relaxed` |
| `--leading-loose` | `--line-height-1-6` | `1.6` | `leading-loose` |

#### Letter Spacing

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--tracking-wide` | `--letter-spacing-wide` | `0.03em` | `tracking-wide` |

### Spacing Scale

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--space-none` | `--spacing-0` | `0px` | `p-none`, `m-none`, `gap-none` |
| `--space-xs` | `--spacing-2` | `2px` | `p-xs`, `m-xs`, `gap-xs` |
| `--space-sm` | `--spacing-4` | `4px` | `p-sm`, `m-sm`, `gap-sm` |
| `--space-md` | `--spacing-8` | `8px` | `p-md`, `m-md`, `gap-md` |
| `--space-lg` | `--spacing-12` | `12px` | `p-lg`, `m-lg`, `gap-lg` |
| `--space-xl` | `--spacing-16` | `16px` | `p-xl`, `m-xl`, `gap-xl` |
| `--space-2xl` | `--spacing-20` | `20px` | `p-2xl`, `m-2xl`, `gap-2xl` |
| `--space-3xl` | `--spacing-24` | `24px` | `p-3xl`, `m-3xl`, `gap-3xl` |
| `--space-4xl` | `--spacing-32` | `32px` | `p-4xl`, `m-4xl`, `gap-4xl` |

### Radius Scale

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--rounded-none` | `--radius-0` | `0px` | `rounded-none` |
| `--rounded-sm` | `--radius-2` | `2px` | `rounded-sm` |
| `--rounded-base` | `--radius-3` | `3px` | `rounded-base` |
| `--rounded-md` | `--radius-4` | `4px` | `rounded-md` |
| `--rounded-lg` | `--radius-10` | `10px` | `rounded-lg` |
| `--rounded-full` | `--radius-full` | `9999px` | `rounded-full` |

### Shadow Scale

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--shadow-sm` | `--shadow-1` | `shadow-sm` |
| `--shadow-md` | `--shadow-2` | `shadow-md` |
| `--shadow-lg` | `--shadow-3` | `shadow-lg` |
| `--shadow-none` | `none` | `shadow-none` |

### Size (Width/Height)

| CSS 변수 | 참조값 | 실제값 | 용도 |
|---------|-------|-------|------|
| `--size-icon-sm` | `--width-16` | `16px` | 작은 아이콘, checkbox |
| `--size-icon-md` | `--width-32` | `32px` | 중간 아이콘, modal close |
| `--size-input-sm` | `--width-200` | `200px` | 작은 input |
| `--size-input-md` | `--width-300` | `300px` | 중간 input |
| `--size-input-lg` | `--width-400` | `400px` | 큰 input |
| `--size-modal-sm` | `--width-400` | `400px` | 작은 modal |
| `--size-modal-md` | `--width-600` | `600px` | 중간 modal |
| `--size-modal-lg` | `--width-900` | `900px` | 큰 modal |

### Z-Index Scale

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--z-base` | `--z-0` | `0` | `z-base` |
| `--z-dropdown` | `--z-10` | `10` | `z-dropdown` |
| `--z-sticky` | `--z-100` | `100` | `z-sticky` |
| `--z-modal` | `--z-1000` | `1000` | `z-modal` |

### Animation Duration

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--duration-fast` | `--duration-150` | `150ms` | `duration-fast` |
| `--duration-normal` | `--duration-200` | `200ms` | `duration-normal` |
| `--duration-slow` | `--duration-1400` | `1400ms` | `duration-slow` |

### State

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--opacity-disabled` | `--opacity-60` | `0.6` | `opacity-disabled` |

---

## Component Tokens

컴포넌트별 스타일 토큰입니다. Semantic 토큰을 참조합니다.

### 공통 Spacing Scale (모든 컴포넌트)

모든 컴포넌트는 동일한 6단계 spacing scale을 사용합니다:

| Size | 참조값 | 실제값 |
|------|-------|-------|
| `sm` | `--space-sm` | `4px` |
| `md` | `--space-md` | `8px` |
| `lg` | `--space-lg` | `12px` |
| `xl` | `--space-xl` | `16px` |
| `2xl` | `--space-2xl` | `20px` |
| `3xl` | `--space-3xl` | `24px` |

---

### Button

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-btn-sm` | `--space-sm` (4px) | `p-btn-sm`, `py-btn-sm`, `px-btn-sm` |
| `--spacing-btn-md` | `--space-md` (8px) | `p-btn-md`, `py-btn-md`, `px-btn-md` |
| `--spacing-btn-lg` | `--space-lg` (12px) | `p-btn-lg`, `py-btn-lg`, `px-btn-lg` |
| `--spacing-btn-xl` | `--space-xl` (16px) | `p-btn-xl`, `py-btn-xl`, `px-btn-xl` |
| `--spacing-btn-2xl` | `--space-2xl` (20px) | `p-btn-2xl`, `py-btn-2xl`, `px-btn-2xl` |
| `--spacing-btn-3xl` | `--space-3xl` (24px) | `p-btn-3xl`, `py-btn-3xl`, `px-btn-3xl` |

#### Typography

| CSS 변수 | 참조값 | 실제값 | 생성 클래스 |
|---------|-------|-------|-----------|
| `--text-btn-sm` | `--text-sm` | `12px` | `text-btn-sm` |
| `--text-btn-md` | `--text-base` | `14px` | `text-btn-md` |
| `--text-btn-lg` | `--text-md` | `15px` | `text-btn-lg` |
| `--font-btn` | `--font-normal` | `400` | `font-btn` |
| `--leading-btn` | `--leading-relaxed` | `1.5` | `leading-btn` |

#### State

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--opacity-btn-disabled` | `--opacity-disabled` (0.6) | `opacity-btn-disabled` |

#### Radius

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--radius-btn` | `--rounded-base` (3px) | `rounded-btn` |

#### Variants (Colors)

**Primary:**
| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-btn-primary-bg` | `--color-primary` | `bg-btn-primary-bg` |
| `--color-btn-primary-bg-hover` | `--color-primary-hover` | `hover:bg-btn-primary-bg-hover` |
| `--color-btn-primary-text` | `--color-primary-foreground` | `text-btn-primary-text` |
| `--color-btn-primary-border` | `--color-primary-hover` | `border-btn-primary-border` |

**Secondary:**
| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-btn-secondary-bg` | `--color-secondary` | `bg-btn-secondary-bg` |
| `--color-btn-secondary-bg-hover` | `--color-secondary-hover` | `hover:bg-btn-secondary-bg-hover` |
| `--color-btn-secondary-text` | `--color-secondary-foreground` | `text-btn-secondary-text` |
| `--color-btn-secondary-border` | `--color-secondary-border` | `border-btn-secondary-border` |

**Destructive:**
| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-btn-destructive-bg` | `--color-destructive` | `bg-btn-destructive-bg` |
| `--color-btn-destructive-bg-hover` | `--color-destructive-hover` | `hover:bg-btn-destructive-bg-hover` |
| `--color-btn-destructive-text` | `--color-destructive-foreground` | `text-btn-destructive-text` |

**Success:**
| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--color-btn-success-bg` | `--color-success` | `bg-btn-success-bg` |
| `--color-btn-success-bg-hover` | `--color-success-hover` | `hover:bg-btn-success-bg-hover` |
| `--color-btn-success-text` | `--color-success-foreground` | `text-btn-success-text` |

---

### Badge

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-badge-sm` ~ `--spacing-badge-3xl` | 4px ~ 24px | `px-badge-sm` ~ `px-badge-3xl` |

#### Height

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-badge-h-sm` | `--size-icon-sm` (16px) | `h-badge-h-sm` |
| `--spacing-badge-h-md` | `--space-2xl` (20px) | `h-badge-h-md` |
| `--spacing-badge-h-lg` | `--space-3xl` (24px) | `h-badge-h-lg` |

#### Typography

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--text-badge-sm` | `--text-xs` (10px) | `text-badge-sm` |
| `--text-badge-md` | `--text-sm` (12px) | `text-badge-md` |
| `--text-badge-lg` | `--text-sm` (12px) | `text-badge-lg` |
| `--font-badge` | `--font-bold` (700) | `font-badge` |
| `--leading-badge` | `--leading-none` (1) | `leading-badge` |

#### Radius

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--radius-badge` | `--rounded-base` (3px) | `rounded-badge` |
| `--radius-badge-pill` | `--rounded-lg` (10px) | `rounded-badge-pill` |

#### Variants

| Variant | Background | Text |
|---------|------------|------|
| primary | `bg-badge-primary-bg` | `text-badge-primary-text` |
| secondary | `bg-badge-secondary-bg` | `text-badge-secondary-text` |
| success | `bg-badge-success-bg` | `text-badge-success-text` |
| destructive | `bg-badge-destructive-bg` | `text-badge-destructive-text` |
| warning | `bg-badge-warning-bg` | `text-badge-warning-text` |
| info | `bg-badge-info-bg` | `text-badge-info-text` |

---

### Input

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-input-sm` ~ `--spacing-input-3xl` | 4px ~ 24px | `py-input-sm`, `px-input-md` 등 |

#### Width

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-input-w-sm` | `--size-input-sm` (200px) | `w-input-w-sm` |
| `--spacing-input-w-md` | `--size-input-md` (300px) | `w-input-w-md` |
| `--spacing-input-w-lg` | `--size-input-lg` (400px) | `w-input-w-lg` |

#### Typography & Radius

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--text-input` | `--text-base` (14px) | `text-input` |
| `--radius-input` | `--rounded-base` (3px) | `rounded-input` |

#### Colors - 다크모드 지원

| CSS 변수 | 생성 클래스 | 용도 | 다크모드 |
|---------|-----------|------|---------|
| `--color-input-bg` | `bg-input-bg` | 기본 배경 | ✅ |
| `--color-input-bg-disabled` | `bg-input-bg-disabled` | 비활성화 배경 | ✅ |
| `--color-input-text` | `text-input-text` | 텍스트 색상 | ✅ |
| `--color-input-border` | `border-input-border` | 기본 테두리 | ✅ |
| `--color-input-border-focus` | `border-input-border-focus` | Focus 테두리 | ❌ |
| `--color-input-border-error` | `border-input-border-error` | Error 테두리 | ❌ |

---

### Label

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-label` | `--text-sm` (12px) | `text-label` | - |
| `--color-label-text` | `--color-label-text` | `text-label-text` | ✅ |
| `--color-label-required` | `--color-destructive` | `text-label-required` | ❌ |
| `--spacing-label-sm` ~ `--spacing-label-3xl` | 4px ~ 24px | `mb-label-sm` 등 | - |

---

### Helper Text

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-helper` | `--text-sm` (12px) | `text-helper` | - |
| `--color-helper-text` | `--color-helper-text` | `text-helper-text` | ✅ |
| `--color-helper-error` | `--color-destructive` | `text-helper-error` | ❌ |
| `--spacing-helper-sm` ~ `--spacing-helper-3xl` | 4px ~ 24px | `mt-helper-sm` 등 | - |

---

### Card

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-card-sm` ~ `--spacing-card-3xl` | 4px ~ 24px | `p-card-sm`, `p-card-2xl` 등 |

#### Base

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--radius-card` | `--rounded-md` (4px) | `rounded-card` | - |
| `--color-card-bg` | `--color-background` | `bg-card-bg` | ✅ |

#### Border & Shadow

| CSS 변수 | 생성 클래스 | 용도 | 다크모드 |
|---------|-----------|------|---------|
| `--color-card-border` | `border-card-border` | 기본 테두리 | ✅ |
| `--color-card-border-subtle` | `border-card-border-subtle` | 약한 테두리 | ✅ |
| `--shadow-card` | `shadow-card` | 기본 그림자 | - |
| `--shadow-card-elevated` | `shadow-card-elevated` | 강조 그림자 | - |
| `--color-card-bg-flat` | `bg-card-bg-flat` | flat 스타일 배경 | ✅ |

#### Header

| CSS 변수 | 생성 클래스 | 다크모드 |
|---------|-----------|---------|
| `--color-card-header-bg` | `bg-card-header-bg` | ✅ |
| `--color-card-header-border` | `border-card-header-border` | ✅ |

#### Title

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-card-title` | `--text-xl` (18px) | `text-card-title` | - |
| `--font-card-title` | `--font-medium` (500) | `font-card-title` | - |
| `--leading-card-title` | `--leading-loose` (1.6) | `leading-card-title` | - |
| `--color-card-title` | `--color-foreground` | `text-card-title` | ✅ |

#### Subtitle

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-card-subtitle` | `--text-base` (14px) | `text-card-subtitle` | - |
| `--leading-card-subtitle` | `--leading-normal` (1.43) | `leading-card-subtitle` | - |
| `--color-card-subtitle` | `--color-foreground-muted` | `text-card-subtitle` | ✅ |

---

### Alert

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-alert-sm` ~ `--spacing-alert-3xl` | 4px ~ 24px | `py-alert-md px-alert-lg`, `gap-alert-md` 등 |
| `--radius-alert` | `--rounded-base` (3px) | `rounded-alert` |

#### Typography

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--text-alert-icon` | `--text-2xl` (20px) | `text-alert-icon` |
| `--text-alert-title` | `--text-md` (15px) | `text-alert-title` |
| `--font-alert-title` | `--font-bold` (700) | `font-alert-title` |
| `--text-alert-body` | `--text-base` (14px) | `text-alert-body` |
| `--leading-alert-body` | `--leading-relaxed` (1.5) | `leading-alert-body` |
| `--text-alert-close` | `--text-2xl` (20px) | `text-alert-close` |

#### Variants

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| info | `bg-alert-info-bg` | `border-alert-info-border` | `text-alert-info-text` |
| success | `bg-alert-success-bg` | `border-alert-success-border` | `text-alert-success-text` |
| warning | `bg-alert-warning-bg` | `border-alert-warning-border` | `text-alert-warning-text` |
| destructive | `bg-alert-destructive-bg` | `border-alert-destructive-border` | `text-alert-destructive-text` |
| default | `bg-alert-default-bg` | `border-alert-default-border` | `text-alert-default-text` |

---

### Modal

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-modal-sm` ~ `--spacing-modal-3xl` | 4px ~ 24px | `p-modal-xl`, `p-modal-3xl` 등 |

#### Width

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-modal-w-sm` | `--size-modal-sm` (400px) | `max-w-modal-w-sm` |
| `--spacing-modal-w-md` | `--size-modal-md` (600px) | `max-w-modal-w-md` |
| `--spacing-modal-w-lg` | `--size-modal-lg` (900px) | `max-w-modal-w-lg` |

#### Overlay & Content

| CSS 변수 | 생성 클래스 | 다크모드 |
|---------|-----------|---------|
| `--color-modal-overlay` | `bg-modal-overlay` | - |
| `--color-modal-bg` | `bg-modal-bg` | ✅ |
| `--radius-modal` | `rounded-modal` | - |
| `--shadow-modal` | `shadow-modal` | - |

#### Title

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-modal-title` | `--text-xl` (18px) | `text-modal-title` | - |
| `--font-modal-title` | `--font-medium` (500) | `font-modal-title` | - |
| `--color-modal-title` | `--color-foreground` | `text-modal-title` | ✅ |

#### Close Button

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-modal-close` | `--text-3xl` (28px) | `text-modal-close` | - |
| `--size-modal-close` | `--size-icon-md` (32px) | `size-modal-close` | - |
| `--color-modal-close` | `--color-foreground-subtle` | `text-modal-close` | ✅ |
| `--color-modal-close-hover` | `--color-hover-overlay` | `hover:bg-modal-close-hover` | - |
| `--radius-modal-close` | `--rounded-full` | `rounded-modal-close` | - |

#### Borders

| CSS 변수 | 생성 클래스 | 다크모드 |
|---------|-----------|---------|
| `--color-modal-header-border` | `border-modal-header-border` | ✅ |
| `--color-modal-footer-border` | `border-modal-footer-border` | ✅ |

---

### Table

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-table-sm` ~ `--spacing-table-3xl` | 4px ~ 24px | `p-table-xl` 등 |

#### Base

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-table` | `--text-base` (14px) | `text-table` | - |
| `--color-table-bg` | `--color-background` | `bg-table-bg` | ✅ |

#### Header

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--color-table-header-bg` | `--color-background-subtle` | `bg-table-header-bg` | ✅ |
| `--text-table-header` | `--text-sm` (12px) | `text-table-header` | - |
| `--font-table-header` | `--font-medium` (500) | `font-table-header` | - |
| `--tracking-table-header` | `--tracking-wide` (0.03em) | `tracking-table-header` | - |
| `--color-table-header-text` | `--color-foreground-muted` | `text-table-header-text` | ✅ |
| `--color-table-header-border` | `--color-border` | `border-table-header-border` | ✅ |

#### Cell

| CSS 변수 | 생성 클래스 | 다크모드 |
|---------|-----------|---------|
| `--color-table-cell-text` | `text-table-cell-text` | ✅ |
| `--color-table-cell-border` | `border-table-cell-border` | ✅ |

#### Variants

| CSS 변수 | 생성 클래스 | 용도 | 다크모드 |
|---------|-----------|------|---------|
| `--color-table-striped-bg` | `bg-table-striped-bg` | 줄무늬 배경 | ✅ |
| `--color-table-hover-bg` | `bg-table-hover-bg` | Hover 배경 | - |
| `--color-table-bordered-border` | `border-table-bordered-border` | bordered 테두리 | ✅ |

---

### Checkbox

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-checkbox-sm` ~ `--spacing-checkbox-3xl` | 4px ~ 24px | `gap-checkbox-md` 등 |

#### Box

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--size-checkbox` | `--size-icon-sm` (16px) | `size-checkbox` |
| `--radius-checkbox` | `--rounded-sm` (2px) | `rounded-checkbox` |

#### Colors

| CSS 변수 | 생성 클래스 | 용도 | 다크모드 |
|---------|-----------|------|---------|
| `--color-checkbox-border` | `border-checkbox-border` | 기본 테두리 | ✅ |
| `--color-checkbox-bg` | `bg-checkbox-bg` | 기본 배경 | ✅ |
| `--color-checkbox-bg-checked` | `bg-checkbox-bg-checked` | 체크 배경 | ❌ |
| `--color-checkbox-border-checked` | `border-checkbox-border-checked` | 체크 테두리 | ❌ |
| `--color-checkbox-checkmark` | `text-checkbox-checkmark` | 체크마크 색상 | ❌ |

#### Label

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-checkbox-label` | `--text-base` (14px) | `text-checkbox-label` | - |
| `--leading-checkbox-label` | `--leading-snug` (1.4) | `leading-checkbox-label` | - |
| `--color-checkbox-label` | `--color-checkbox-label` | `text-checkbox-label` | ✅ |
| `--color-checkbox-label-error` | `--color-red-500` | `text-checkbox-label-error` | ❌ |

#### Hint

| CSS 변수 | 참조값 | 생성 클래스 | 다크모드 |
|---------|-------|-----------|---------|
| `--text-checkbox-hint` | `--text-sm` (12px) | `text-checkbox-hint` | - |
| `--color-checkbox-hint` | `--color-checkbox-hint` | `text-checkbox-hint` | ✅ |

---

### Textarea

#### Spacing

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-textarea-sm` ~ `--spacing-textarea-3xl` | 4px ~ 24px | `p-textarea-xl` 등 |

#### Base

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--text-textarea` | `--text-lg` (16px) | `text-textarea` |
| `--leading-textarea` | `--leading-tight` (1.1876) | `leading-textarea` |
| `--radius-textarea` | `--rounded-md` (4px) | `rounded-textarea` |

#### Colors

| CSS 변수 | 생성 클래스 | 용도 | 다크모드 |
|---------|-----------|------|---------|
| `--color-textarea-border` | `border-textarea-border` | 기본 테두리 | ✅ |
| `--color-textarea-border-focus` | `focus:border-textarea-border-focus` | Focus 테두리 | ❌ |
| `--color-textarea-border-error` | `border-textarea-border-error` | Error 테두리 | ❌ |
| `--color-textarea-bg` | `bg-textarea-bg` | 기본 배경 | ✅ |
| `--color-textarea-bg-disabled` | `bg-textarea-bg-disabled` | 비활성화 배경 | ✅ |
| `--color-textarea-text` | `text-textarea-text` | 텍스트 색상 | ✅ |

---

### Form Group

| CSS 변수 | 참조값 | 생성 클래스 |
|---------|-------|-----------|
| `--spacing-form-group-sm` ~ `--spacing-form-group-3xl` | 4px ~ 24px | `mb-form-group-xl` 등 |

---

## 다크 모드

### 아키텍처

다크 모드는 **3단계 체이닝**으로 구현됩니다:

```
┌─────────────────────────────────────────────────────────────────┐
│  primitive.css                                                  │
│                                                                 │
│  :root {                                                        │
│    --raw-background: var(--color-white);  ← Light 기본값        │
│  }                                                              │
│                                                                 │
│  .dark {                                                        │
│    --raw-background: var(--color-gray-800);  ← Dark 오버라이드  │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  semantic.css                                                   │
│                                                                 │
│  @theme inline {                                                │
│    --color-background: var(--raw-background);                   │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  컴파일 결과                                                     │
│                                                                 │
│  .bg-background {                                               │
│    background: var(--raw-background);                           │
│  }                         ↑                                    │
│                            └─ .dark 클래스 적용 시 자동 변경     │
└─────────────────────────────────────────────────────────────────┘
```

### 설정

다크 모드는 `.dark` 클래스를 통해 활성화됩니다:

```tsx
// 다크 모드 토글
<html className="dark">
  ...
</html>
```

### index.css의 다크 모드 variant 설정

```css
@custom-variant dark (&:is(.dark *));
```

### 자동 변경되는 토큰

`.dark` 클래스 적용 시 자동으로 변경되는 토큰들:

| 카테고리 | Light | Dark |
|---------|-------|------|
| **Background** | | |
| `--raw-background` | `white` | `gray-800` |
| `--raw-background-subtle` | `gray-50` | `gray-700` |
| `--raw-background-muted` | `gray-100` | `gray-700` |
| `--raw-background-disabled` | `gray-100` | `gray-600` |
| **Foreground** | | |
| `--raw-foreground` | `black-a87` | `white` |
| `--raw-foreground-muted` | `black-a60` | `gray-300` |
| `--raw-foreground-subtle` | `black-a54` | `gray-400` |
| **Border** | | |
| `--raw-border` | `black-a12` | `gray-600` |
| `--raw-border-subtle` | `black-a8` | `gray-700` |
| `--raw-border-input` | `gray-350` | `gray-500` |
| **Form Elements** | | |
| `--raw-input-text` | `black` | `white` |
| `--raw-label-text` | `gray-800` | `gray-200` |
| `--raw-helper-text` | `gray-600` | `gray-400` |
| `--raw-checkbox-border` | `gray-300` | `gray-500` |
| `--raw-checkbox-label` | `gray-750` | `gray-200` |
| `--raw-checkbox-hint` | `gray-550` | `gray-400` |
| `--raw-textarea-border` | `black-a23` | `gray-500` |
| `--raw-textarea-bg-disabled` | `black-a12` | `gray-700` |

### 사용 예시

```tsx
// 다크 모드 자동 적용 (별도 클래스 불필요)
<div className="bg-background text-foreground">
  자동으로 다크 모드에서 색상 변경
</div>

// 컴포넌트 토큰 사용 - 다크모드 자동 적용
<div className="bg-card-bg text-card-title border-card-border">
  Card 컴포넌트
</div>

// 다크 모드 커스텀 스타일 (수동)
<div className="bg-white dark:bg-gray-800">
  수동 다크 모드 설정
</div>
```

---

## 사용 예시

### Button 예시

```tsx
// Primary Button - Medium
<button className="
  py-btn-md px-btn-2xl
  bg-btn-primary-bg text-btn-primary-text
  text-btn-md font-btn leading-btn
  rounded-btn
  hover:bg-btn-primary-bg-hover
  disabled:opacity-btn-disabled
  transition-colors
">
  Primary Button
</button>

// Secondary Button - Small
<button className="
  py-btn-sm px-btn-lg
  bg-btn-secondary-bg text-btn-secondary-text
  border border-btn-secondary-border
  text-btn-sm font-btn leading-btn
  rounded-btn
  hover:bg-btn-secondary-bg-hover
">
  Secondary
</button>

// Destructive Button
<button className="
  py-btn-md px-btn-2xl
  bg-btn-destructive-bg text-btn-destructive-text
  rounded-btn
  hover:bg-btn-destructive-bg-hover
">
  Delete
</button>
```

### Badge 예시

```tsx
// Primary Badge
<span className="
  inline-flex items-center justify-center
  px-badge-md h-badge-h-md
  bg-badge-primary-bg text-badge-primary-text
  text-badge-md font-badge leading-badge
  rounded-badge
">
  New
</span>

// Pill Badge
<span className="
  px-badge-lg h-badge-h-lg
  bg-badge-success-bg text-badge-success-text
  text-badge-lg font-badge
  rounded-badge-pill
">
  Success
</span>
```

### Card 예시

```tsx
<div className="
  bg-card-bg
  border border-card-border
  rounded-card
  shadow-card
">
  {/* Header */}
  <div className="
    p-card-2xl
    bg-card-header-bg
    border-b border-card-header-border
  ">
    <h3 className="text-card-title font-card-title leading-card-title text-card-title">
      Card Title
    </h3>
    <p className="text-card-subtitle leading-card-subtitle text-card-subtitle mt-card-sm">
      Card subtitle
    </p>
  </div>

  {/* Body */}
  <div className="p-card-2xl">
    Content here
  </div>
</div>
```

### Alert 예시

```tsx
// Info Alert
<div className="
  py-alert-md px-alert-lg
  bg-alert-info-bg
  border border-alert-info-border
  text-alert-info-text
  rounded-alert
  flex gap-alert-md
">
  <span className="text-alert-icon">ℹ️</span>
  <div>
    <p className="text-alert-title font-alert-title">Info Title</p>
    <p className="text-alert-body leading-alert-body">Info message here.</p>
  </div>
</div>

// Success Alert
<div className="
  py-alert-md px-alert-lg
  bg-alert-success-bg border-alert-success-border text-alert-success-text
  border rounded-alert
">
  Success message
</div>
```

### Modal 예시

```tsx
// Overlay
<div className="
  fixed inset-0
  bg-modal-overlay
  z-modal
  flex items-center justify-center
  p-modal-xl
">
  {/* Content */}
  <div className="
    w-full max-w-modal-w-md
    bg-modal-bg
    rounded-modal
    shadow-modal
  ">
    {/* Header */}
    <div className="
      p-modal-xl
      border-b border-modal-header-border
      flex justify-between items-center
    ">
      <h2 className="text-modal-title font-modal-title text-modal-title">
        Modal Title
      </h2>
      <button className="
        size-modal-close
        rounded-modal-close
        text-modal-close
        hover:bg-modal-close-hover
        flex items-center justify-center
      ">
        ×
      </button>
    </div>

    {/* Body */}
    <div className="p-modal-3xl">
      Modal content
    </div>

    {/* Footer */}
    <div className="
      p-modal-xl
      border-t border-modal-footer-border
      flex gap-modal-md justify-end
    ">
      <button>Cancel</button>
      <button>Confirm</button>
    </div>
  </div>
</div>
```

### Table 예시

```tsx
<table className="w-full bg-table-bg text-table">
  <thead className="bg-table-header-bg">
    <tr>
      <th className="
        p-table-xl
        text-table-header text-table-header-text
        font-table-header tracking-table-header
        uppercase text-left
        border-b-2 border-table-header-border
      ">
        Column
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-table-hover-bg">
      <td className="
        p-table-xl
        text-table-cell-text
        border-b border-table-cell-border
      ">
        Cell
      </td>
    </tr>
  </tbody>
</table>
```

### Checkbox 예시

```tsx
<label className="flex items-start gap-checkbox-md cursor-pointer">
  <div className="
    size-checkbox
    rounded-checkbox
    border-2 border-checkbox-border
    bg-checkbox-bg
    data-[checked]:bg-checkbox-bg-checked
    data-[checked]:border-checkbox-border-checked
    flex items-center justify-center
  ">
    <span className="text-checkbox-checkmark text-checkbox-checkmark">✓</span>
  </div>
  <span className="text-checkbox-label leading-checkbox-label text-checkbox-label">
    Checkbox label
  </span>
</label>
```

### Input 예시

```tsx
<div className="mb-form-group-xl">
  <label className="
    block mb-label-sm
    text-label text-label-text font-bold
  ">
    Label <span className="text-label-required">*</span>
  </label>

  <input
    type="text"
    className="
      w-full
      py-input-md px-input-lg
      text-input text-input-text
      bg-input-bg
      border border-input-border
      rounded-input
      focus:border-input-border-focus focus:outline-none
      disabled:bg-input-bg-disabled
    "
  />

  <p className="mt-helper-sm text-helper text-helper-text">
    Helper text here
  </p>
</div>
```

---

## shadcn/ui 통합

### Button Component

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center font-btn leading-btn rounded-btn transition-colors disabled:opacity-btn-disabled disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-btn-primary-bg text-btn-primary-text hover:bg-btn-primary-bg-hover',
        secondary: 'bg-btn-secondary-bg text-btn-secondary-text border border-btn-secondary-border hover:bg-btn-secondary-bg-hover',
        destructive: 'bg-btn-destructive-bg text-btn-destructive-text hover:bg-btn-destructive-bg-hover',
        success: 'bg-btn-success-bg text-btn-success-text hover:bg-btn-success-bg-hover',
      },
      size: {
        sm: 'py-btn-sm px-btn-lg text-btn-sm',
        md: 'py-btn-md px-btn-2xl text-btn-md',
        lg: 'py-btn-lg px-btn-3xl text-btn-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
```

### Badge Component

```tsx
// components/ui/badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center justify-center font-badge leading-badge whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-badge-primary-bg text-badge-primary-text',
        secondary: 'bg-badge-secondary-bg text-badge-secondary-text',
        success: 'bg-badge-success-bg text-badge-success-text',
        destructive: 'bg-badge-destructive-bg text-badge-destructive-text',
        warning: 'bg-badge-warning-bg text-badge-warning-text',
        info: 'bg-badge-info-bg text-badge-info-text',
      },
      size: {
        sm: 'px-badge-sm h-badge-h-sm text-badge-sm',
        md: 'px-badge-md h-badge-h-md text-badge-md',
        lg: 'px-badge-lg h-badge-h-lg text-badge-lg',
      },
      pill: {
        true: 'rounded-badge-pill',
        false: 'rounded-badge',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      pill: false,
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, pill, ...props }: BadgeProps) {
  return (
    <span
      className={badgeVariants({ variant, size, pill, className })}
      {...props}
    />
  );
}
```

### Alert Component

```tsx
// components/ui/alert.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva(
  'py-alert-md px-alert-lg rounded-alert border flex gap-alert-md',
  {
    variants: {
      variant: {
        info: 'bg-alert-info-bg border-alert-info-border text-alert-info-text',
        success: 'bg-alert-success-bg border-alert-success-border text-alert-success-text',
        warning: 'bg-alert-warning-bg border-alert-warning-border text-alert-warning-text',
        destructive: 'bg-alert-destructive-bg border-alert-destructive-border text-alert-destructive-text',
        default: 'bg-alert-default-bg border-alert-default-border text-alert-default-text',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
}

export function Alert({ className, variant, title, children, ...props }: AlertProps) {
  return (
    <div className={alertVariants({ variant, className })} {...props}>
      <div className="flex-1">
        {title && (
          <p className="text-alert-title font-alert-title mb-alert-sm">
            {title}
          </p>
        )}
        <div className="text-alert-body leading-alert-body">{children}</div>
      </div>
    </div>
  );
}
```

### Card Component

```tsx
// components/ui/card.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'bg-card-bg rounded-card overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border border-card-border shadow-card',
        bordered: 'border border-card-border shadow-none',
        elevated: 'border border-card-border-subtle shadow-card-elevated',
        flat: 'border border-card-border-subtle shadow-none bg-card-bg-flat',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cardVariants({ variant, className })} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-card-2xl bg-card-header-bg border-b border-card-header-border ${className}`}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-card-title font-card-title leading-card-title text-card-title ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-card-subtitle leading-card-subtitle text-card-subtitle mt-card-sm ${className}`}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-card-2xl ${className}`} {...props} />;
}
```

### Input Component

```tsx
// components/ui/input.tsx
import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full text-input text-input-text bg-input-bg border rounded-input focus:outline-none focus:border-input-border-focus disabled:bg-input-bg-disabled disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        sm: 'py-input-sm px-input-md',
        md: 'py-input-md px-input-lg',
        lg: 'py-input-lg px-input-xl',
      },
      error: {
        true: 'border-input-border-error',
        false: 'border-input-border',
      },
      width: {
        sm: 'w-input-w-sm',
        md: 'w-input-w-md',
        lg: 'w-input-w-lg',
        full: 'w-full',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
      width: 'full',
    },
  }
);

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, error, width, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={inputVariants({ size, error, width, className })}
        {...props}
      />
    );
  }
);
```

---

## 마이그레이션 가이드

### 기존 하드코딩된 값을 토큰으로 변환

```tsx
// Before (하드코딩)
<button className="px-4 py-2 bg-blue-500 text-white rounded">
  Button
</button>

// After (토큰 사용)
<button className="px-btn-2xl py-btn-md bg-btn-primary-bg text-btn-primary-text rounded-btn">
  Button
</button>
```

### CSS 변수 직접 사용

```css
/* 토큰을 CSS에서 직접 사용 */
.custom-component {
  padding: var(--spacing-btn-md);
  background-color: var(--color-btn-primary-bg);
  border-radius: var(--radius-btn);
}
```

### JavaScript에서 토큰 값 읽기

```javascript
// 런타임에 CSS 변수 값 읽기
const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue('--color-primary');
```

---

## 주의사항

1. **토큰 파일 수정 시**: primitive → semantic → components 순서로 체이닝되므로, 상위 레벨 변경 시 하위 레벨에 영향
2. **네임스페이스 규칙**: Tailwind v4의 네임스페이스 규칙을 반드시 따라야 클래스 생성
3. **@theme vs @theme inline**:
   - `@theme`: 정적 값 정의 (리터럴 값)
   - `@theme inline`: 다른 변수 참조 시 사용 (다크모드 지원)
4. **동적 변수**: 다크모드 등 런타임 변경이 필요한 값은 `@theme` 바깥에서 `:root`/`.dark`로 정의
5. **Dark Mode**: `.dark` 클래스 기반, `--raw-*` 동적 변수가 자동으로 변경됨

---

## Quick Reference

### @theme 사용 시점
- 정적 리터럴 값 정의: `--color-white: #ffffff`
- Tailwind 유틸리티 클래스 생성 필요 시

### @theme inline 사용 시점
- 다른 CSS 변수 참조: `--color-background: var(--raw-background)`
- 다크모드 지원이 필요한 토큰

### :root / .dark 사용 시점
- 런타임에 동적으로 변경되어야 하는 값
- 다크모드 전환 시 변경되어야 하는 원본 변수

```css
/* 패턴 요약 */
@theme {
  --color-white: #ffffff;  /* 정적 값 */
}

:root {
  --raw-background: var(--color-white);  /* 동적 원본 (Light) */
}

.dark {
  --raw-background: var(--color-gray-800);  /* 동적 원본 (Dark) */
}

@theme inline {
  --color-background: var(--raw-background);  /* 동적 참조 */
}
```
