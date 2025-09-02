import { useMutation, useQuery } from '@tanstack/react-query';
import { login, signup, searchUsers } from '../services/authService';

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    },
    onError: (error) => {
      console.error('Signup error:', error);
    },
  });
};

export const useSearchUsers = (query, enabled = true) => {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: () => searchUsers(query),
    enabled: enabled && !!query && query.length > 2,
    staleTime: 30000, // 30 seconds
  });
};
