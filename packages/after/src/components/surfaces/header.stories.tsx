import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Header,
  HeaderContainer,
  HeaderSection,
  HeaderLogo,
  HeaderTitleGroup,
  HeaderTitle,
  HeaderSubtitle,
  HeaderUserSection,
  HeaderUserInfo,
  HeaderUserName,
  HeaderUserEmail,
  HeaderAvatar,
  HeaderThemeToggle,
} from './header';
import { ThemeProvider } from '@/providers/theme-provider';

const meta = {
  title: 'Surfaces/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
        </HeaderSection>
        <HeaderSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
          <HeaderTitleGroup>
            <HeaderTitle>Dashboard</HeaderTitle>
            <HeaderSubtitle>Manage your account</HeaderSubtitle>
          </HeaderTitleGroup>
        </HeaderSection>
        <HeaderSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};

export const WithUserSection: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
        </HeaderSection>
        <HeaderSection>
          <HeaderUserSection>
            <HeaderUserInfo>
              <HeaderUserName>김철수</HeaderUserName>
              <HeaderUserEmail>kim@example.com</HeaderUserEmail>
            </HeaderUserInfo>
            <HeaderAvatar>김</HeaderAvatar>
          </HeaderUserSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};

export const Complete: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
          <HeaderTitleGroup>
            <HeaderTitle>Analytics Dashboard</HeaderTitle>
            <HeaderSubtitle>Real-time metrics and insights</HeaderSubtitle>
          </HeaderTitleGroup>
        </HeaderSection>
        <HeaderSection>
          <HeaderUserSection>
            <HeaderUserInfo>
              <HeaderUserName>이영희</HeaderUserName>
              <HeaderUserEmail>lee@example.com</HeaderUserEmail>
            </HeaderUserInfo>
            <HeaderAvatar>이</HeaderAvatar>
          </HeaderUserSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};

export const WithImageLogo: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
        </HeaderSection>
        <HeaderSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};

export const WithImageAvatar: Story = {
  render: () => (
    <Header>
      <HeaderContainer>
        <HeaderSection>
          <HeaderLogo>L</HeaderLogo>
        </HeaderSection>
        <HeaderSection>
          <HeaderUserSection>
            <HeaderUserInfo>
              <HeaderUserName>박민수</HeaderUserName>
              <HeaderUserEmail>park@example.com</HeaderUserEmail>
            </HeaderUserInfo>
            <HeaderAvatar>박</HeaderAvatar>
          </HeaderUserSection>
          <HeaderThemeToggle />
        </HeaderSection>
      </HeaderContainer>
    </Header>
  ),
};
