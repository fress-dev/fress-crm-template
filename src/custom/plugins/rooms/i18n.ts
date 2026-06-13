/** rooms プラグイン用の i18n 差し込み（CrmMessages 型外のキーを merge で追加） */
export const roomsPluginI18n = {
  resources: {
    rooms: {
      name: "部屋 |||| 部屋",
      fields: {
        name: "部屋名",
        store_id: "所属店舗",
        created_at: "登録日時",
        updated_at: "更新日時",
      },
      action: {
        create: "部屋を登録",
        edit: "部屋を修正",
        new: "新しい部屋",
        show: "部屋の詳細",
      },
      empty: {
        title: "部屋がありません",
        description: "まだ部屋が登録されていません。",
      },
      confirm: {
        delete_title: "「%{name}」を削除",
        delete_content: "この部屋を一覧から非表示にします。",
      },
      filters: {
        include_deleted: "削除済みを含む",
      },
      status: {
        deleted: "削除済み",
      },
      validation: {
        name_required: "部屋名を入力してください",
        name_max_length: "部屋名は%{max}文字以内で入力してください",
        store_id_required: "所属店舗を選択してください",
        duplicate_name: "同じ名前の部屋がこの店舗に既にあります",
      },
    },
  },
};
