// --- src/components/checkout/CheckoutStepIndicator.tsx ---
import { CheckCircle as CheckCircleIcon } from "lucide-react";
interface CheckoutStepIndicatorProps {
  currentStep: number;
  steps: { title: string; icon: React.ElementType }[];
}
export const CheckoutStepIndicator: React.FC<CheckoutStepIndicatorProps> = ({ currentStep, steps }) => (
  <div className="mb-10 p-4 bg-white rounded-lg shadow-md border border-slate-200">
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-around">
        {steps.map((step, stepIdx) => (
          <li key={step.title} className={`relative ${stepIdx !== steps.length - 1 ? "flex-1" : ""}`}>
            {stepIdx < currentStep - 1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  {stepIdx !== steps.length - 1 && <div className="h-0.5 w-full bg-green-600" />}
                </div>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-green-600 hover:bg-green-700">
                  <CheckCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  <span className="sr-only">{step.title} - Completed</span>
                </span>
              </>
            ) : stepIdx === currentStep - 1 ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  {stepIdx !== steps.length - 1 && <div className="h-0.5 w-full bg-slate-200" />}
                </div>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-600 bg-white" aria-current="step">
                  <span className="h-3 w-3 rounded-full bg-green-600" aria-hidden="true" />
                  <span className="sr-only">{step.title} - Current</span>
                </span>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  {stepIdx !== steps.length - 1 && <div className="h-0.5 w-full bg-slate-200" />}
                </div>
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-white hover:border-slate-400">
                  <span className="sr-only">{step.title} - Upcoming</span>
                </span>
              </>
            )}
            <p className={`absolute -bottom-6 text-xs text-center w-full ${stepIdx === currentStep - 1 ? "font-semibold text-green-700" : "text-slate-500"}`}>
              {step.title}
            </p>
          </li>
        ))}
      </ol>
    </nav>
  </div>
);
