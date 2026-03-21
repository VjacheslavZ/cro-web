import { useMutation } from '@tanstack/react-query';

import { apiClient } from './client';

export interface SessionWord {
  wordId: string;
  baseForm: string;
  pluralForm?: string | null;
  translationRu: string;
  translationUk: string;
  translationEn: string;
}

export interface CreateSessionResponse {
  cycleExhausted: boolean;
  session: {
    id: string;
    exerciseType: string;
    wordSetId: string;
    status: string;
    totalQuestions: number;
    words: SessionWord[];
  } | null;
}

export interface FinishSessionResponse {
  sessionId: string;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  newXpTotal: number;
  currentStreak: number;
  longestStreak: number;
}

export function useCreateSession() {
  return useMutation({
    mutationFn: async (params: { wordSetId: string; exerciseType: string }) => {
      const { data } = await apiClient.post<CreateSessionResponse>('/exercises/sessions', params);
      return data;
    },
  });
}

export function useFinishSession() {
  return useMutation({
    mutationFn: async (params: {
      sessionId: string;
      answers: { wordId: string; givenAnswer: string; isCorrect: boolean }[];
    }) => {
      const { data } = await apiClient.post<FinishSessionResponse>(
        `/exercises/sessions/${params.sessionId}/finish`,
        { answers: params.answers },
      );
      return data;
    },
  });
}

export function useResetCycle() {
  return useMutation({
    mutationFn: async (params: { wordSetId: string; exerciseType: string }) => {
      const { data } = await apiClient.post('/exercises/cycle-reset', params);
      return data;
    },
  });
}
