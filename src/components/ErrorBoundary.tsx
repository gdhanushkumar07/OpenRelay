// src/components/ErrorBoundary.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an uncaught rendering error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-200 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center text-center h-full min-h-[160px]">
          <div className="flex flex-col items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600 animate-pulse" />
            <h4 className="text-xs font-syne uppercase font-bold text-red-700">
              {this.props.fallbackTitle || "Component Load Error"}
            </h4>
            <p className="text-[10px] text-red-700/60 leading-relaxed font-semibold max-w-[240px]">
              {this.state.error?.message || "Render pipeline encountered an unexpected exception."}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
