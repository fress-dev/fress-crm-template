/** courses プラグイン用の i18n 差し込み（CrmMessages 型外のキーを merge で追加） */
export const coursesPluginI18n = {
  resources: {
    courses: {
      name: "コース |||| コース",
      fields: {
        name: "コース名",
        description: "説明",
        course_type: "コース種別",
        service_kind: "提供内容",
        duration_minutes: "標準時間（分）",
        is_active: "新規選択で使う",
        display_order: "表示順",
        store_ids: "提供店舗",
        created_at: "登録日時",
        updated_at: "更新日時",
      },
      action: {
        create: "コースを登録",
        edit: "コースを修正",
        new: "新しいコース",
        show: "コースの詳細",
      },
      empty: {
        title: "コースがありません",
        description: "まだコースが登録されていません。",
      },
      choices: {
        course_type: {
          ticket: "回数券",
          membership: "月額・契約",
          single: "単発",
        },
        service_kind: {
          training: "トレーニング",
          stretch: "ストレッチ",
          training_and_stretch: "トレーニング・ストレッチ",
        },
      },
      status: {
        active: "有効",
        inactive: "停止中",
      },
      show: {
        no_stores: "提供店舗なし",
      },
      form: {
        no_stores: "店舗が未登録です",
      },
      confirm: {
        delete_title: "「%{name}」を削除",
        delete_content:
          "このコースを削除します。契約などで参照されている場合は削除できません。",
      },
      validation: {
        name_required: "コース名を入力してください",
        name_max_length: "コース名は80文字以内で入力してください",
        duplicate_name: "同じ名前のコースが既にあります",
        description_max_length: "説明は500文字以内で入力してください",
        course_type_required: "コース種別を選んでください",
        service_kind_required: "提供内容を選んでください",
        duration_required: "標準時間を入力してください",
        duration_range: "標準時間は1〜600分で入力してください",
        display_order_required: "表示順を入力してください",
        display_order_range: "表示順は0〜9999で入力してください",
      },
    },
  },
};
