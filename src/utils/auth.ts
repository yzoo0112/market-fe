// utils/auth.ts
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  roles: string[];
}

export function getUserRoleFromToken(token: string): string[] {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.roles || [];
  } catch (e) {
    return [];
  }
}

export function isAdmin(token: string): boolean {
    try {
      if (!token || typeof token !== 'string') return false;
  
      const cleanToken = token.replace(/^Bearer\s/, '');
      const decoded = jwtDecode<{ sub: string; roles?: string[] | string }>(cleanToken);
      
      const roles = decoded.roles;
  
      if (Array.isArray(roles)) {
        return roles.includes('ROLE_ADMIN');
      }
  
      if (typeof roles === 'string') {
        return roles === 'ROLE_ADMIN';
      }
  
      return false;
    } catch (e) {
      console.error('❌ Token decoding failed:', e);
      return false;
    }
}
