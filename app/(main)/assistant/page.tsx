import { Sparkles } from "lucide-react";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";

export default function AssistantPage() {
  return (
    <PagePlaceholder
      icon={Sparkles}
      title="AI Assistant — Coming Soon"
      description="A conversational interface for project queries. Risk predictions remain the responsibility of the ML models and Risk Engine."
    />
  );
}
