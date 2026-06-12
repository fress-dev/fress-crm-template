import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";

type CourseFormToolbarProps = {
  label?: string;
};

/**
 * Select / Number 入力を含む Card 内フォームでは type="submit" が効かないため、
 * SaveButton は type="button" で明示的に submit する。
 */
export const CourseFormToolbar = ({ label }: CourseFormToolbarProps) => (
  <div
    role="toolbar"
    className="sticky flex pt-4 pb-4 md:pb-0 bottom-0 bg-linear-to-b from-transparent to-card to-10% flex-row justify-end gap-2"
  >
    <CancelButton />
    <SaveButton type="button" label={label} />
  </div>
);
