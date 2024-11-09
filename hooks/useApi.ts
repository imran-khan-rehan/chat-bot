'use client';
import { useState, useCallback } from "react";
import { useAbortController } from "./useAbortController";
import {
  UNEXPECTED_ERROR,
  API_RESPONSE_CANCELLATION_ERROR,
} from "../utils/constants";
import {
  ClientApiResponse,
  ApiRequest,
  ApiHandlerResult,
  isApiError,
} from "../types";
import axios from "axios";

export const useApi = (): ApiHandlerResult => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getAbortSignal } = useAbortController();

  const handleApi = useCallback(
    async <T>(apiRequest: ApiRequest<T>): Promise<ClientApiResponse<T>> => {
      setIsLoading(true);
      const abortSignal = getAbortSignal();
      try {
        const response = await apiRequest(abortSignal);
        return { error: null, response };
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          return { error: API_RESPONSE_CANCELLATION_ERROR };
        } else if (isApiError(error)) {
          const { message: errorMessage } = error;
          return { error: errorMessage };
        } else {
          return { error: UNEXPECTED_ERROR };
        }
      } finally {
        setIsLoading(false);
      }
    },
    [getAbortSignal]
  );

  return { isLoading, handleApi };
};
