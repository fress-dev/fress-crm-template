import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import { countContactsForStore } from "./countContactsForStore";

describe("countContactsForStore", () => {
  it("store_id フィルタで件数を返す", async () => {
    const getList = vi.fn().mockResolvedValue({ data: [], total: 3 });
    const dataProvider = { getList } as unknown as DataProvider;

    const count = await countContactsForStore(dataProvider, 42);

    expect(count).toBe(3);
    expect(getList).toHaveBeenCalledWith(
      "contacts",
      expect.objectContaining({
        filter: { store_id: 42 },
      }),
    );
  });
});
