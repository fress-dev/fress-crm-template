import { useEffect, useState } from "react";
import {
  useDataProvider,
  useGetList,
  useRecordContext,
  useTranslate,
} from "ra-core";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import type { Sale } from "@/components/atomic-crm/types";

import { ACTIVE_STORE_FILTER } from "./withStoresDataProvider";
import type { StoresDataProvider } from "./storesDataProviderTypes";

type SalesStoreInputsProps = {
  value: number[];
  onChange: (storeIds: number[]) => void;
};

/** 管理者がスタッフの担当店舗を編集するチェックボックス群 */
export const SalesStoreInputs = ({
  value,
  onChange,
}: SalesStoreInputsProps) => {
  const translate = useTranslate();
  const record = useRecordContext<Sale>();
  const { data: stores = [], isPending } = useGetList("stores", {
    pagination: { page: 1, perPage: 100 },
    sort: { field: "name", order: "ASC" },
    filter: ACTIVE_STORE_FILTER,
  });

  const targetIsAdmin = record?.administrator === true;

  // 利用者編集は管理者のみ到達可能（sales ポリシー）。対象が管理者なら全店舗可のため UI 不要
  if (targetIsAdmin || !record) {
    return null;
  }

  if (isPending) {
    return (
      <p className="text-sm text-muted-foreground">
        {translate("resources.stores.sales_scope.loading")}
      </p>
    );
  }

  return (
    <div className="space-y-3 border-t pt-4">
      <div>
        <h3 className="text-sm font-medium">
          {translate("resources.stores.sales_scope.title")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {translate("resources.stores.sales_scope.description")}
        </p>
      </div>
      {stores.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {translate("resources.stores.sales_scope.no_stores")}
        </p>
      ) : (
        <div className="space-y-2">
          {stores.map((store) => {
            const storeId = store.id as number;
            const checked = value.includes(storeId);
            return (
              <div key={storeId} className="flex items-center gap-2">
                <Checkbox
                  id={`sales-store-${storeId}`}
                  checked={checked}
                  onCheckedChange={(next) => {
                    if (next === true) {
                      onChange([...value, storeId]);
                      return;
                    }
                    onChange(value.filter((id) => id !== storeId));
                  }}
                />
                <Label htmlFor={`sales-store-${storeId}`}>{store.name}</Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** 編集画面用 — 初期値を dataProvider から読み込む */
export const useSalesStoreAssignment = (salesId: number | undefined) => {
  const dataProvider = useDataProvider<StoresDataProvider>();
  const [storeIds, setStoreIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (salesId == null) {
      setStoreIds([]);
      setLoaded(false);
      return;
    }

    let cancelled = false;
    setLoaded(false);

    dataProvider
      .getSalesStoreIds(salesId)
      .then((ids) => {
        if (!cancelled) {
          setStoreIds(ids);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStoreIds([]);
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dataProvider, salesId]);

  return { storeIds, setStoreIds, loaded };
};
