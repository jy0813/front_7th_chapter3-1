import React, { useState } from 'react';
import { ManagementPage } from './pages/ManagementPage';
import { UIShowcasePage } from './pages/UIShowcasePage';
import '@/tokens/index.css';
import {
  Header,
  HeaderAvatar,
  HeaderContainer,
  HeaderLogo,
  HeaderSection,
  HeaderSubtitle,
  HeaderThemeToggle,
  HeaderTitle,
  HeaderTitleGroup,
  HeaderUserEmail,
  HeaderUserInfo,
  HeaderUserName,
  HeaderUserSection,
} from '@/components/surfaces';

export const App: React.FC = () => {
  return (
    <div className="bg-background-subtle min-h-screen">
      <Header>
        <HeaderContainer>
          <HeaderSection>
            <HeaderLogo>L</HeaderLogo>
            <HeaderTitleGroup>
              <HeaderTitle>Hanghae Company</HeaderTitle>
              <HeaderSubtitle>Design System Migration Project</HeaderSubtitle>
            </HeaderTitleGroup>
          </HeaderSection>
          <HeaderUserSection>
            <HeaderThemeToggle />
            <HeaderUserInfo>
              <HeaderUserName>Demo User</HeaderUserName>
              <HeaderUserEmail>demo@example.com</HeaderUserEmail>
            </HeaderUserInfo>
            <HeaderAvatar>DU</HeaderAvatar>
          </HeaderUserSection>
        </HeaderContainer>
      </Header>

      <main className="w-full px-8 py-4">
        <ManagementPage />
      </main>
    </div>
  );
};
