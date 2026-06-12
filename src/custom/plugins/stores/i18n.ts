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
        created_at: "登録日時",
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
      confirm: {
        delete_title: "「%{name}」を削除",
        delete_content:
          "この店舗を一覧から非表示にします。在籍会員の参照は維持されます。",
      },
      filters: {
        include_deleted: "削除済みを含む",
      },
      status: {
        deleted: "削除済み",
      },
      sales_scope: {
        title: "担当店舗",
        description:
          "選択した店舗の会員のみ閲覧・編集できます。未選択の場合は全店舗にアクセスできます。",
        loading: "担当店舗を読み込み中…",
        no_stores: "有効な店舗がありません。先に店舗を登録してください。",
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
