import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Button } from '@/components/inputs/button';

const meta = {
  title: 'Surfaces/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated', 'flat'],
      description: 'Card의 시각적 스타일을 결정합니다.',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card variant="default" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-base">
          This is the card content area. You can put any content here.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const Bordered: Story = {
  render: () => (
    <Card variant="bordered" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>Card with a prominent border</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-base">
          This card has a visible border for better definition.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Card with shadow elevation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-base">
          This card appears elevated with shadow effects.
        </p>
      </CardContent>
    </Card>
  ),
};

export const Flat: Story = {
  render: () => (
    <Card variant="flat" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Flat Card</CardTitle>
        <CardDescription>Card with minimal styling</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-base">
          This card has a flat, minimal appearance.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithoutHeader: Story = {
  render: () => (
    <Card variant="bordered" style={{ width: '350px' }}>
      <CardContent>
        <p className="typo-body-base">
          A simple card without a header. Just content.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card variant="default" style={{ width: '350px' }}>
      <CardHeader>
        <CardTitle>Card without Footer</CardTitle>
        <CardDescription>
          This card doesn't have a footer section
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="typo-body-base">Card content without a footer area.</p>
      </CardContent>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4" style={{ width: '720px' }}>
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Default card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm">Card content</p>
        </CardContent>
      </Card>
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Bordered</CardTitle>
          <CardDescription>Bordered card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm">Card content</p>
        </CardContent>
      </Card>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Elevated card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm">Card content</p>
        </CardContent>
      </Card>
      <Card variant="flat">
        <CardHeader>
          <CardTitle>Flat</CardTitle>
          <CardDescription>Flat card variant</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="typo-body-sm">Card content</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const ComplexCard: Story = {
  render: () => (
    <Card variant="bordered" style={{ width: '400px' }}>
      <CardHeader>
        <CardTitle>Project Update</CardTitle>
        <CardDescription>Last updated 2 hours ago</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="typo-body-base mb-2 font-bold">Progress</h4>
            <div className="bg-background-muted h-2 overflow-hidden rounded-full">
              <div className="bg-primary h-full" style={{ width: '65%' }}></div>
            </div>
            <p className="typo-body-sm text-foreground-muted mt-1">
              65% complete
            </p>
          </div>
          <div>
            <h4 className="typo-body-base mb-2 font-bold">Details</h4>
            <p className="typo-body-sm text-foreground-muted">
              The project is on track and progressing well. We expect to
              complete the remaining tasks within the next sprint.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Button variant="primary" className="flex-1">
            View Details
          </Button>
          <Button variant="outline" className="flex-1">
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  ),
};
