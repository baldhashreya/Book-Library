import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "../utils/logger";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Uncaught React UI Error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack as unknown as Record<string, unknown>
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p>We are working on getting this fixed.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
