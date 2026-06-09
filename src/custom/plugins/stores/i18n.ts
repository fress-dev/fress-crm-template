/** stores プラグイン用の i18n 差し込み（CrmMessages 型外のキーを merge で追加） */
export const storesPluginI18n = {
  resources: {
    stores: {
      name: "店舗 |||| 店舗",
      fields: {
        name: "店舗名",
        area_code: "エリアコード",
        zip: "郵便番号",
        address: "住所",
        build: "建物名",
        created_at: "登録日",
      },
      action: {
        create: "店舗を登録",
        edit: "店舗を修正",
        new: "新しい店舗",
      },
    },
    contacts: {
      fields: {
        store_id: "在籍店舗",
      },
    },
  },
};
