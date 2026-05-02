// components/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';  // useAuth 훅을 사용하여 인증 상태 가져오기
import type { ReactNode } from 'react';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { token, isAuthenticated } = useAuth();  // useAuth로 인증 상태와 token 가져오기

  // 인증되지 않았거나 token이 없으면 리디렉션
  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  return children;  // 인증된 사용자에게만 자식 컴포넌트를 렌더링
}
