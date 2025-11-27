import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from './native-select';
import { Label } from './label';

const meta = {
  title: 'Inputs/NativeSelect',
  component: NativeSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fieldWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
      description: 'Select의 너비를 결정합니다.',
    },
    disabled: {
      control: 'boolean',
      description: 'Select의 비활성화 상태를 결정합니다.',
    },
  },
} satisfies Meta<typeof NativeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <NativeSelect>
      <NativeSelectOption value="">Select an option</NativeSelectOption>
      <NativeSelectOption value="1">Option 1</NativeSelectOption>
      <NativeSelectOption value="2">Option 2</NativeSelectOption>
      <NativeSelectOption value="3">Option 3</NativeSelectOption>
    </NativeSelect>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="country">Country</Label>
      <NativeSelect id="country">
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="kr">Korea</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="jp">Japan</NativeSelectOption>
        <NativeSelectOption value="cn">China</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="small">Small Width</Label>
      <NativeSelect id="small" fieldWidth="sm">
        <NativeSelectOption value="">Select</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

export const Medium: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="medium">Medium Width</Label>
      <NativeSelect id="medium" fieldWidth="md">
        <NativeSelectOption value="">Select</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

export const Large: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="large">Large Width</Label>
      <NativeSelect id="large" fieldWidth="lg">
        <NativeSelectOption value="">Select</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '100%' }}>
      <Label htmlFor="full">Full Width</Label>
      <NativeSelect id="full" fieldWidth="full">
        <NativeSelectOption value="">Select an option</NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const WithOptGroups: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="optgroup">Category</Label>
      <NativeSelect id="optgroup">
        <NativeSelectOption value="">Select a category</NativeSelectOption>
        <NativeSelectOptGroup label="Fruits">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Vegetables">
          <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
          <NativeSelectOption value="potato">Potato</NativeSelectOption>
          <NativeSelectOption value="tomato">Tomato</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="disabled">Disabled Select</Label>
      <NativeSelect id="disabled" disabled>
        <NativeSelectOption value="">
          This select is disabled
        </NativeSelectOption>
        <NativeSelectOption value="1">Option 1</NativeSelectOption>
        <NativeSelectOption value="2">Option 2</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="flex flex-col gap-2" style={{ width: '300px' }}>
      <Label htmlFor="error">Payment Method</Label>
      <NativeSelect
        id="error"
        className="border-destructive focus:ring-destructive"
        aria-invalid="true"
      >
        <NativeSelectOption value="">Select payment method</NativeSelectOption>
        <NativeSelectOption value="card">Credit Card</NativeSelectOption>
        <NativeSelectOption value="bank">Bank Transfer</NativeSelectOption>
        <NativeSelectOption value="paypal">PayPal</NativeSelectOption>
      </NativeSelect>
      <p className="typo-helper-text text-destructive">
        Please select a payment method
      </p>
    </div>
  ),
};
