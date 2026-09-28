import { FolderKanban } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  return (
    <PagePlaceholder
      icon={FolderKanban}
      title={`Project ${params.id}`}
      description="Cost, expenditure, progress, Delay/Cost/Overall Risk, explanation and similar projects will appear here."
      cta={{ href: "/explorer", label: "Back to Project Explorer" }}
    />
  );
}
