import { useMutation } from "@tanstack/react-query";
import {
  useDataProvider,
  useEditController,
  useNotify,
  useRecordContext,
  useRedirect,
  useTranslate,
} from "ra-core";
import type { SubmitHandler } from "react-hook-form";
import { SimpleForm } from "@/components/admin/simple-form";
import { CancelButton } from "@/components/admin/cancel-button";
import { SaveButton } from "@/components/admin/form";
import { Card, CardContent } from "@/components/ui/card";
import { SalesInputs } from "@/components/atomic-crm/sales/SalesInputs";

import type { CrmDataProvider } from "@/components/atomic-crm/providers/types";
import type { Sale, SalesFormData } from "@/components/atomic-crm/types";

import { isStoresPluginEnabled } from "./isStoresPluginEnabled";
import { SalesStoreInputs, useSalesStoreAssignment } from "./SalesStoreInputs";
import type { StoresDataProvider } from "./storesDataProviderTypes";

function EditToolbar() {
  return (
    <div className="flex justify-end gap-4">
      <CancelButton />
      <SaveButton />
    </div>
  );
}

export function SalesEdit() {
  const { record } = useEditController<Sale>();
  const storesEnabled = isStoresPluginEnabled();
  const salesId =
    storesEnabled && record?.id != null ? Number(record.id) : undefined;
  const { storeIds, setStoreIds } = useSalesStoreAssignment(salesId);

  const dataProvider = useDataProvider<CrmDataProvider & StoresDataProvider>();
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();

  const { mutate } = useMutation({
    mutationKey: ["salesUpdate"],
    mutationFn: async (data: SalesFormData) => {
      if (!record) {
        throw new Error(
          translate("resources.sales.edit.record_not_found", {
            _: "Record not found",
          }),
        );
      }

      const updated = await dataProvider.salesUpdate(record.id, data);

      if (storesEnabled && !record.administrator) {
        await dataProvider.setSalesStoreIds(record.id, storeIds);
      }

      return updated;
    },
    onSuccess: () => {
      redirect("/sales");
      notify("resources.sales.edit.success", {
        messageArgs: {
          _: "User updated successfully",
        },
      });
    },
    onError: () => {
      notify("resources.sales.edit.error", {
        type: "error",
        messageArgs: {
          _: "An error occurred. Please try again.",
        },
      });
    },
  });

  const onSubmit: SubmitHandler<SalesFormData> = async (data) => {
    mutate(data);
  };

  return (
    <div className="max-w-lg w-full mx-auto mt-8">
      <Card>
        <CardContent>
          <SimpleForm
            toolbar={<EditToolbar />}
            onSubmit={onSubmit as SubmitHandler<any>}
            record={record}
          >
            <SaleEditTitle />
            <SalesInputs />
            {storesEnabled ? (
              <SalesStoreInputs value={storeIds} onChange={setStoreIds} />
            ) : null}
          </SimpleForm>
        </CardContent>
      </Card>
    </div>
  );
}

const SaleEditTitle = () => {
  const record = useRecordContext<Sale>();
  const translate = useTranslate();
  if (!record) return null;
  return (
    <h2 className="text-lg font-semibold mb-4">
      {translate("resources.sales.edit.title", {
        name: `${record.first_name} ${record.last_name}`,
      })}
    </h2>
  );
};
