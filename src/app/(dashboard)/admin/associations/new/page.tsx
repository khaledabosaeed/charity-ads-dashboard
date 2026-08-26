import { createAssociation } from "../actions";
import { AssociationForm } from "../association-form";
import { PageHeading } from "@/components/layout/page-heading";

export default function NewAssociationPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeading titleKey="associations.new" />
      <AssociationForm action={createAssociation} />
    </div>
  );
}
