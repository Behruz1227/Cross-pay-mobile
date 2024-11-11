// ErrorBoundary.tsx
import React from 'react';
import { Alert } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: any): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can log the error to an error reporting service here
    Alert.alert("QR - Pay", "QR yaratib bo'lmadi"); // Display the alert
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI here
      return null; // Don't render anything; the alert has been shown
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
