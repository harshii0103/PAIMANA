export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 bg-white py-24 text-center">
      <h2 className="text-lg font-semibold text-ink-900">Project {params.id}</h2>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        Cost, Expenditure, Progress, Delay/Cost/Overall Risk, explanation, and Similar Projects. Coming next.
      </p>
    </div>
  );
}
