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
        show: "店舗の詳細",
      },
      empty: {
        title: "店舗がありません",
        description: "まだ店舗が登録されていません。",
      },
      show: {
        contact_count: "在籍会員: %{count}人",
      },
      validation: {
        name_required: "店舗名を入力してください",
        name_max_length: "店舗名は%{max}文字以内で入力してください",
        duplicate_name: "同じ名前の店舗が既にあります",
        zip_format: "郵便番号は 123-4567 または 7 桁の数字で入力してください",
        area_code_format:
          "エリアコードは英数字・ハイフン・アンダースコアのみ使用できます",
        area_code_max_length: "エリアコードは20文字以内で入力してください",
        address_max_length: "住所は200文字以内で入力してください",
        build_max_length: "建物名は100文字以内で入力してください",
        delete_has_contacts: "在籍会員がいる店舗は削除できません",
      },
    },
    contacts: {
      fields: {
        store_id: "在籍店舗",
      },
      filters: {
        no_store: "在籍店舗なし",
      },
    },
  },
};
