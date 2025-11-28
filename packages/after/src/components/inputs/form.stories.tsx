import type { Meta, StoryObj } from '@storybook/react-vite';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Input } from './input';
import { Button } from './button';
import { Textarea } from './textarea';
import { NativeSelect, NativeSelectOption } from './native-select';

const meta = {
  title: 'Inputs/Form',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

// BasicForm 컴포넌트로 추출
const BasicFormExample = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4"
        style={{ width: '400px' }}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const BasicForm: Story = {
  render: () => <BasicFormExample />,
};

// WithValidation 컴포넌트로 추출
const WithValidationExample = () => {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        style={{ width: '400px' }}
      >
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                Must be at least 8 characters long.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  );
};

export const WithValidation: Story = {
  render: () => <WithValidationExample />,
};

// WithTextarea 컴포넌트로 추출
const WithTextareaExample = () => {
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4"
        style={{ width: '500px' }}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" rows={4} {...field} />
              </FormControl>
              <FormDescription>Provide a detailed description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
};

export const WithTextarea: Story = {
  render: () => <WithTextareaExample />,
};

// WithSelect 컴포넌트로 추출
const WithSelectExample = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      country: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4"
        style={{ width: '400px' }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value="">
                    Select a country
                  </NativeSelectOption>
                  <NativeSelectOption value="kr">Korea</NativeSelectOption>
                  <NativeSelectOption value="us">
                    United States
                  </NativeSelectOption>
                  <NativeSelectOption value="jp">Japan</NativeSelectOption>
                  <NativeSelectOption value="cn">China</NativeSelectOption>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export const WithSelect: Story = {
  render: () => <WithSelectExample />,
};

// ComplexForm 컴포넌트로 추출
const ComplexFormExample = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      message: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => console.log(data))}
        className="flex flex-col gap-4"
        style={{ width: '600px' }}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email',
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="010-1234-5678" {...field} />
              </FormControl>
              <FormDescription>Optional contact number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          rules={{ required: 'Please select a country' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value="">
                    Select your country
                  </NativeSelectOption>
                  <NativeSelectOption value="kr">Korea</NativeSelectOption>
                  <NativeSelectOption value="us">
                    United States
                  </NativeSelectOption>
                  <NativeSelectOption value="jp">Japan</NativeSelectOption>
                  <NativeSelectOption value="cn">China</NativeSelectOption>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share any additional information
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" variant="primary">
            Submit
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const ComplexForm: Story = {
  render: () => <ComplexFormExample />,
};
