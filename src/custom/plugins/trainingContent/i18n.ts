/** training-content プラグイン用の i18n 差し込み（CrmMessages 型外のキーを merge で追加） */
export const trainingContentPluginI18n = {
  resources: {
    training_types: {
      name: "種目カテゴリ |||| 種目カテゴリ",
      fields: {
        name: "カテゴリ名",
        display_order: "表示順",
        is_active: "新規選択で使う",
        created_at: "登録日時",
        updated_at: "更新日時",
      },
      action: {
        create: "カテゴリを登録",
        edit: "カテゴリを修正",
        new: "新しいカテゴリ",
      },
      empty: {
        title: "種目カテゴリがありません",
        description:
          "まだ種目カテゴリ（部位）が登録されていません。先にカテゴリを作成してください。",
      },
      status: {
        active: "有効",
        inactive: "停止中",
      },
      confirm: {
        delete_title: "「%{name}」を削除",
        delete_content:
          "このカテゴリを削除します。種目が紐づいている場合は削除できません。",
      },
      validation: {
        name_required: "カテゴリ名を入力してください",
        name_max_length: "カテゴリ名は80文字以内で入力してください",
        duplicate_name: "同じ名前のカテゴリが既にあります",
        display_order_required: "表示順を入力してください",
        display_order_range: "表示順は0〜9999で入力してください",
      },
    },
    training_groups: {
      name: "種目 |||| 種目",
      fields: {
        training_type_id: "カテゴリ",
        name: "種目名",
        description: "説明",
        display_order: "表示順",
        is_active: "新規選択で使う",
        created_at: "登録日時",
        updated_at: "更新日時",
      },
      action: {
        create: "種目を登録",
        edit: "種目を修正",
        new: "新しい種目",
        show: "種目の詳細",
      },
      empty: {
        title: "種目がありません",
        description: "まだ種目が登録されていません。",
      },
      status: {
        active: "有効",
        inactive: "停止中",
      },
      show: {
        no_type: "カテゴリ未設定",
      },
      form: {
        no_types: "カテゴリが未登録です。先に種目カテゴリを作成してください。",
      },
      confirm: {
        delete_title: "「%{name}」を削除",
        delete_content:
          "この種目を削除します。セッション記録などで参照されている場合は削除できません。",
      },
      validation: {
        name_required: "種目名を入力してください",
        name_max_length: "種目名は80文字以内で入力してください",
        duplicate_name: "同じカテゴリに同じ名前の種目が既にあります",
        description_max_length: "説明は500文字以内で入力してください",
        training_type_required: "カテゴリを選んでください",
        display_order_required: "表示順を入力してください",
        display_order_range: "表示順は0〜9999で入力してください",
      },
    },
  },
};
