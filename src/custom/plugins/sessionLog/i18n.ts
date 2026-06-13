/** session-log プラグイン用の i18n 差し込み */
export const sessionLogPluginI18n = {
  resources: {
    session_logs: {
      name: "セッション記録 |||| セッション記録",
      fields: {
        appointment_id: "予約",
        contact_id: "会員",
        sales_id: "担当スタッフ",
        store_id: "店舗",
        membership_ticket_id: "消費チケット",
        performed_at: "実施日時",
        weight_kg: "体重 (kg)",
        body_fat_percent: "体脂肪率 (%)",
        visceral_fat_level: "内臓脂肪レベル",
        blood_pressure: "血圧",
        waist_cm: "ウエスト (cm)",
        basal_metabolism_kcal: "基礎代謝 (kcal)",
        muscle_mass_kg: "筋肉量 (kg)",
        body_age: "体年齢",
        body_water_percent: "体水分 (%)",
        comment: "コメント",
        created_at: "登録日時",
      },
      action: {
        create: "セッション記録を登録",
        edit: "セッション記録を修正",
        new: "新しいセッション記録",
        show: "セッション記録の詳細",
        create_from_appointment: "セッション記録を作成",
      },
      empty: {
        title: "セッション記録がありません",
        description: "まだセッション記録が登録されていません。",
      },
      confirm: {
        delete_title: "このセッション記録を削除",
        delete_content: "このセッション記録を一覧から非表示にします。",
      },
      validation: {
        contact_required: "会員を選択してください",
        sales_required: "担当スタッフを選択してください",
        performed_at_required: "実施日時を入力してください",
      },
      error: {
        ticket_required: "消費するチケットを選択してください",
        ticket_not_available: "選択したチケットは利用できません",
        ticket_contact_mismatch: "チケットの会員が一致しません",
      },
    },
  },
};
