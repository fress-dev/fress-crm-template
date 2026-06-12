/** appointments プラグイン用の i18n 差し込み */
export const appointmentsPluginI18n = {
  resources: {
    appointments: {
      name: "予約 |||| 予約",
      fields: {
        contact_id: "会員",
        sales_id: "担当スタッフ",
        store_id: "店舗",
        start_at: "開始日時",
        end_at: "終了日時",
        type: "種別",
        title: "タイトル・メモ",
        created_at: "登録日時",
      },
      action: {
        create: "予約を登録",
        edit: "予約を修正",
        new: "新しい予約",
        show: "予約の詳細",
      },
      empty: {
        title: "予約がありません",
        description: "まだ予約が登録されていません。",
      },
      confirm: {
        delete_title: "この予約を削除",
        delete_content: "この予約を一覧から非表示にします。",
      },
      views: {
        table: "一覧",
        calendar: "カレンダー",
      },
      validation: {
        sales_required: "担当スタッフを選択してください",
        start_required: "開始日時を入力してください",
        end_required: "終了日時を入力してください",
        end_after_start: "終了日時は開始日時より後にしてください",
        type_required: "種別を選択してください",
      },
    },
  },
};
