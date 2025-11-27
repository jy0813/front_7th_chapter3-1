import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'Inputs/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'Input의 타입을 결정합니다.',
    },
    placeholder: {
      control: 'text',
      description: '입력 필드의 플레이스홀더 텍스트를 설정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: 'Input의 비활성화 상태를 결정합니다.',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter your username" />
    </div>
  ),
};

export const Email: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="name@example.com" />
    </div>
  ),
};

export const Password: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter your password" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="disabled">Disabled Input</Label>
      <Input id="disabled" placeholder="This input is disabled" disabled />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="error">Email</Label>
      <Input
        id="error"
        type="email"
        placeholder="name@example.com"
        className="border-destructive focus:ring-destructive"
      />
      <p className="typo-helper-text text-destructive">
        Please enter a valid email address
      </p>
    </div>
  ),
};
