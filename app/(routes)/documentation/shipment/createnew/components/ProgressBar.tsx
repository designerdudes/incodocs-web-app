interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    return (
        <div className="w-full bg-gray-200 h-2 rounded">
            <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
        </div>
    );
}
