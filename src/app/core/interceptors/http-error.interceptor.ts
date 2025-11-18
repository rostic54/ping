import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs';
import { ToasterService } from '../services/utils/toaster.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(ToasterService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      messageService.showError(
        messageFormatter(error));
      throw error;
    })
  );
};

function messageFormatter(error: HttpErrorResponse): { [key: string]: string } {
  console.log('HTTP Error Interceptor caught an error:', error);
  
  const getErrorSeverity = (status: number): string => {
    if (status >= 400 && status < 500) return 'Client Error';
    if (status >= 500) return 'Server Error';
    return 'Network Error';
  };

  const getErrorSummary = (status: number): string => {
    switch (status) {
      case 400: return 'Bad Request';
      case 401: return 'Unauthorized';
      case 403: return 'Forbidden';
      case 404: return 'Not Found';
      case 408: return 'Request Timeout';
      case 409: return 'Conflict';
      case 422: return 'Validation Error';
      case 429: return 'Too Many Requests';
      case 500: return 'Internal Server Error';
      case 502: return 'Bad Gateway';
      case 503: return 'Service Unavailable';
      case 504: return 'Gateway Timeout';
      case 0: return 'Network Error';
      default: return `Error ${status}`;
    }
  };

  const errorMessage = error.error?.message || error.message || 'An unknown error occurred';
  const errorDetail = error.error?.detail || '';
  const url = `URL: ${error.url}`;
  const status = error.status;
  
  const formattedDetail = [
    `Status: ${status} - ${getErrorSummary(status)}`,
    errorMessage,
    errorDetail,
    url
  ].filter(Boolean).join('\n');

  return {
    summary: `${getErrorSeverity(status)}: ${getErrorSummary(status)}`,
    detail: formattedDetail
  };
}
