import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="flex min-h-screen items-center justify-center bg-[#F4F7FB] p-8"
        >
          <div className="flex w-full max-w-2xl flex-col items-center p-8 text-center">
            <AlertTriangle size={48} className="mb-6 text-[#B42318]" />
            <h1 className="text-[22px] font-black text-[#0F1F3D]">
              حدث خطأ غير متوقع
            </h1>
            <p className="mt-3 text-sm font-semibold text-[#5E6E8C]">
              يرجى تحديث الصفحة والمحاولة مرة أخرى.
            </p>
            {this.state.error && (
              <pre className="mt-6 max-h-48 w-full overflow-auto whitespace-break-spaces rounded-xl border border-[#E7ECF4] bg-white p-4 text-right text-xs text-[#5E6E8C]">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-extrabold text-white transition-[filter] hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}
            >
              <RotateCcw size={16} />
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
