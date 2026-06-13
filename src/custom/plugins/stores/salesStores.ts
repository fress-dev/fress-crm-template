import type { Identifier } from "ra-core";

import { getSupabaseClient } from "@/components/atomic-crm/providers/supabase/supabase";

/** sales_stores から担当店舗 ID 一覧を取得する */
export const fetchSalesStoreIds = async (
  salesId: Identifier,
): Promise<number[]> => {
  const { data, error } = await getSupabaseClient()
    .from("sales_stores")
    .select("store_id")
    .eq("sales_id", salesId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => row.store_id as number);
};

/** 担当店舗を差し替える（管理者のみ RLS で許可） */
export const replaceSalesStoreIds = async (
  salesId: Identifier,
  storeIds: number[],
): Promise<void> => {
  const client = getSupabaseClient();

  const { error: deleteError } = await client
    .from("sales_stores")
    .delete()
    .eq("sales_id", salesId);

  if (deleteError) {
    throw deleteError;
  }

  if (storeIds.length === 0) {
    return;
  }

  const { error: insertError } = await client.from("sales_stores").insert(
    storeIds.map((storeId) => ({
      sales_id: salesId,
      store_id: storeId,
    })),
  );

  if (insertError) {
    throw insertError;
  }
};
