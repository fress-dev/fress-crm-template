/** memberships プラグイン用の i18n 差し込み */
export const membershipsPluginI18n = {
  resources: {
    memberships: {
      name: "契約 |||| 契約",
      fields: {
        contact_id: "会員",
        course_id: "コース",
        store_id: "契約店舗",
        ticket_count: "発行枚数",
        status: "契約状態",
        started_at: "開始日",
        ended_at: "終了日",
        notes: "メモ",
        available_ticket_count: "未使用チケット",
        used_ticket_count: "使用済みチケット",
        created_at: "登録日時",
        updated_at: "更新日時",
      },
      action: {
        create: "契約を登録",
        edit: "契約を修正",
        new: "新しい契約",
        show: "契約の詳細",
      },
      empty: {
        title: "契約がありません",
        description: "まだ契約が登録されていません。",
      },
      choices: {
        status: {
          active: "契約中",
          completed: "完了",
          cancelled: "取消",
        },
        ticket_status: {
          available: "未使用",
          reserved: "予約中",
          used: "使用済み",
          cancelled: "取消",
        },
      },
      tickets: {
        title: "回数券一覧",
        empty: "回数券がありません",
      },
      form: {
        no_store: "店舗なし",
      },
      confirm: {
        delete_title: "契約 #%{id} を削除",
        delete_content:
          "未使用チケット %{available} 枚を含む契約を削除します。使用中・予約中のチケットがある場合は削除できません。",
      },
      notification: {
        deleted: "契約 #%{id} を削除しました",
      },
      error: {
        delete_locked_tickets:
          "使用中または予約中のチケットがあるため削除できません",
      },
      validation: {
        contact_required: "会員を選んでください",
        course_required: "コースを選んでください",
        ticket_count_required: "発行枚数を入力してください",
        ticket_count_range: "発行枚数は1〜999枚で入力してください",
      },
    },
  },
};
