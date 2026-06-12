import type { DataProvider } from "ra-core";
import { describe, expect, it, vi } from "vitest";

import { createStoreNameUniqueCheck } from "./useStoreNameUniqueCheck";

describe("createStoreNameUniqueCheck", () => {
  it("有効店舗一覧に同名があれば true を返す", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: [{ id: 2, name: "船橋店" }],
      total: 1,
    });
    const dataProvider = { getList } as unknown as DataProvider;

    const isDuplicate = await createStoreNameUniqueCheck(dataProvider)(
      "船橋店",
      1,
    );

    expect(isDuplicate).toBe(true);
    expect(getList).toHaveBeenCalledWith(
      "stores",
      expect.objectContaining({
        filter: {},
      }),
    );
  });

  it("自分自身は重複とみなさない", async () => {
    const getList = vi.fn().mockResolvedValue({
      data: [{ id: 1, name: "船橋店" }],
      total: 1,
    });
    const dataProvider = { getList } as unknown as DataProvider;

    const isDuplicate = await createStoreNameUniqueCheck(dataProvider)(
      "船橋店",
      1,
    );

    expect(isDuplicate).toBe(false);
  });
});
