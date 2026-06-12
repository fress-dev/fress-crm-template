import {
  CreateBase,
  Form,
  useGetIdentity,
  useListContext,
  useNotify,
  useRecordContext,
  useResourceContext,
  useTranslate,
  useUpdate,
  type Identifier,
  type RaRecord,
} from "ra-core";
import { useFormContext } from "react-hook-form";
import { SaveButton } from "@/components/admin/form";
import { cn } from "@/lib/utils";

import { NoteInputs } from "@/components/atomic-crm/notes/NoteInputs";
import { foreignKeyMapping } from "@/components/atomic-crm/notes/foreignKeyMapping";
import { getCurrentDate, serializeNoteDate } from "./utils";

export const NoteCreate = ({
  reference,
  showStatus,
  className,
}: {
  reference: "contacts" | "deals";
  showStatus?: boolean;
  className?: string;
}) => {
  const resource = useResourceContext();
  const record = useRecordContext();
  const { identity } = useGetIdentity();

  if (!record || !identity) return null;

  const defaultStatus = reference === "contacts" ? record.status : undefined;

  return (
    <CreateBase resource={resource} redirect={false}>
      <Form>
        <div className={cn("space-y-3", className)}>
          <NoteInputs defaultStatus={defaultStatus} showStatus={showStatus} />
          <NoteCreateButton
            defaultStatus={defaultStatus}
            record={record}
            reference={reference}
          />
        </div>
      </Form>
    </CreateBase>
  );
};

const NoteCreateButton = ({
  defaultStatus,
  reference,
  record,
}: {
  defaultStatus?: string;
  reference: "contacts" | "deals";
  record: RaRecord<Identifier>;
}) => {
  const [update] = useUpdate();
  const notify = useNotify();
  const translate = useTranslate();
  const { identity } = useGetIdentity();
  const { reset } = useFormContext();
  const { refetch } = useListContext();

  if (!record || !identity) return null;

  const resetValues: {
    date: string;
    text: null;
    attachments: null;
    status?: string;
  } = {
    date: getCurrentDate(),
    text: null,
    attachments: null,
  };

  const handleSuccess = (data: any) => {
    if (reference === "contacts") {
      resetValues.status = data.status ?? defaultStatus;
    }

    reset(resetValues, { keepValues: false });
    refetch();
    update(reference, {
      id: (record && record.id) as unknown as Identifier,
      data: {
        last_seen: reference === "contacts" ? serializeNoteDate() : undefined,
        status: data.status,
      },
      previousData: record,
    });
    notify("resources.notes.added", {
      messageArgs: {
        _: "Note added",
      },
    });
  };

  return (
    <div className="flex justify-end">
      <SaveButton
        type="button"
        label={translate("resources.notes.action.add_this")}
        transform={(data) => ({
          ...data,
          [foreignKeyMapping[reference]]: record.id,
          sales_id: identity.id,
          date: serializeNoteDate(data.date),
        })}
        mutationOptions={{
          onSuccess: handleSuccess,
        }}
      />
    </div>
  );
};
