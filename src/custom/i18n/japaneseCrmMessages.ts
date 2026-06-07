import type { CrmMessages } from "@/components/atomic-crm/providers/commons/englishCrmMessages";

/**
 * 50〜60代でも読みやすい日本語。
 * - カタカナ語・英語の専門用語を避け、意味が伝わる言い方にする
 * - 画面ラベルは短く、説明文は丁寧な「です・ます」調
 */
export const japaneseCrmMessages: CrmMessages = {
  resources: {
    companies: {
      name: "取引先企業 |||| 取引先企業",
      forcedCaseName: "取引先企業",
      fields: {
        name: "企業名",
        website: "ホームページ",
        linkedin_url: "LinkedInのページ",
        phone_number: "電話番号",
        created_at: "登録日",
        nb_contacts: "担当者の人数",
        revenue: "売上高",
        sector: "業種",
        size: "従業員の規模",
        tax_identifier: "法人番号・税番号",
        address: "住所",
        city: "市区町村",
        zipcode: "郵便番号",
        state_abbr: "都道府県",
        country: "国",
        description: "メモ・備考",
        context_links: "関連するリンク",
        sales_id: "担当の営業",
      },
      empty: {
        description: "まだ企業が登録されていません。",
        title: "企業がありません",
      },
      field_categories: {
        contact: "連絡先",
        additional_info: "その他の情報",
        address: "住所",
        context: "補足情報",
      },
      action: {
        create: "企業を登録",
        edit: "企業を修正",
        new: "新しい企業",
        show: "企業の詳細",
      },
      added_on: "%{date}に登録",
      followed_by: "%{name}が担当",
      followed_by_you: "あなたが担当",
      no_contacts: "担当者なし",
      nb_contacts: "%{smart_count}人 |||| %{smart_count}人",
      nb_deals: "%{smart_count}件の商談 |||| %{smart_count}件の商談",
      sizes: {
        one_employee: "1人",
        two_to_nine_employees: "2〜9人",
        ten_to_forty_nine_employees: "10〜49人",
        fifty_to_two_hundred_forty_nine_employees: "50〜249人",
        two_hundred_fifty_or_more_employees: "250人以上",
      },
      autocomplete: {
        create_error: "企業の登録中にエラーが起きました",
        create_item: "「%{item}」を新規登録",
        create_label: "名前を入力して新しい企業を登録",
      },
      filters: {
        only_mine: "自分が担当の企業だけ",
      },
    },
    contacts: {
      name: "担当者 |||| 担当者",
      forcedCaseName: "担当者",
      field_categories: {
        background_info: "経歴・背景",
        identity: "お名前",
        misc: "その他",
        personal_info: "連絡先",
        position: "役職",
      },
      fields: {
        first_name: "名（下の名前）",
        last_name: "姓（苗字）",
        last_seen: "最後に連絡した日",
        title: "役職・肩書き",
        company_id: "所属する企業",
        email_jsonb: "メールアドレス",
        email: "メール",
        phone_jsonb: "電話番号",
        phone_number: "電話番号",
        linkedin_url: "LinkedInのページ",
        background: "メモ（経歴、出会ったきっかけなど）",
        has_newsletter: "お知らせメールを受け取る",
        sales_id: "担当の営業",
      },
      action: {
        add: "担当者を追加",
        add_first: "最初の担当者を登録",
        create: "担当者を登録",
        edit: "担当者を修正",
        export_vcard: "連絡先ファイルに書き出す",
        new: "新しい担当者",
        show: "担当者の詳細",
      },
      background: {
        last_activity_on: "最後の動き: %{date}",
        added_on: "%{date}に登録",
        followed_by: "%{name}が担当",
        followed_by_you: "あなたが担当",
        status_none: "未設定",
      },
      position_at: "%{title}（",
      position_at_company: "%{company}の%{title}",
      empty: {
        description: "まだ担当者が登録されていません。",
        title: "担当者がありません",
      },
      import: {
        title: "担当者をファイルから取り込む",
        button: "CSVファイルを取り込む",
        complete:
          "取り込みが終わりました。%{importCount}件を登録し、%{errorCount}件はエラーになりました。",
        progress:
          "担当者を%{importCount} / %{rowCount}件取り込みました（エラー: %{errorCount}件）。",
        error:
          "ファイルを読み込めませんでした。正しいCSVファイルを選んでください。",
        imported: "取り込み済み",
        remaining_time: "残り時間の目安:",
        running: "取り込み中です。この画面を閉じないでください。",
        sample_download: "見本ファイルをダウンロード",
        sample_hint: "この見本を参考にファイルを作れます",
        stop: "取り込みを中止",
        csv_file: "CSVファイル",
        contacts_label: "担当者 |||| 担当者",
      },
      inputs: {
        genders: {
          male: "男性",
          female: "女性",
          nonbinary: "その他",
        },
        personal_info_types: {
          work: "勤務先",
          home: "自宅",
          other: "その他",
        },
      },
      list: {
        error_loading: "担当者の読み込みに失敗しました",
      },
      bulk_tag: {
        action: "ラベルを付ける",
        back: "ラベル一覧に戻る",
        create_description:
          "新しいラベルを作り、選んだ担当者に付けます。",
        description:
          "既にあるラベルを選ぶか、新しいラベルを作って担当者に付けてください。",
        empty: "ラベルがありません。先にラベルを作ってください。",
        error: "ラベルの付与に失敗しました",
        noop: "選んだ担当者には、すでにこのラベルが付いています",
        success:
          "%{smart_count}人にラベルを付けました |||| %{smart_count}人にラベルを付けました",
        title: "担当者にラベルを付ける",
      },
      merge: {
        action: "別の担当者とまとめる",
        confirm: "まとめる",
        current_contact: "まとめ元（削除されます）",
        description: "2人の担当者の情報を1人にまとめます。",
        error: "まとめる処理に失敗しました",
        merging: "まとめています…",
        no_additional_data: "まとめる追加データがありません",
        select_target: "残す担当者を選んでください",
        success: "担当者をまとめました",
        target_contact: "残す担当者",
        title: "担当者をまとめる",
        warning_description:
          "すべてのデータが残す側の担当者に移ります。この操作は取り消せません。",
        warning_title: "ご注意（元に戻せません）",
        what_will_be_merged: "まとめられる内容:",
      },
      filters: {
        before_last_month: "先月より前",
        before_this_month: "今月より前",
        before_this_week: "今週より前",
        managed_by_me: "自分が担当",
        search: "名前・企業名で探す…",
        this_week: "今週",
        today: "今日",
        tags: "ラベル",
        tasks: "タスク",
      },
      hot: {
        empty_change_status:
          "担当者にメモを追加し、「その他の項目を表示」を押して、お客様の見込みを選んでください。",
        empty_hint: "「有力」と設定したお客様が、ここに表示されます。",
        title: "有力なお客様",
      },
    },
    deals: {
      name: "商談 |||| 商談",
      fields: {
        name: "商談の名前",
        description: "内容・メモ",
        company_id: "取引先企業",
        contact_ids: "担当者",
        category: "種類",
        amount: "金額（予算）",
        expected_closing_date: "成約予定日",
        stage: "進捗",
      },
      action: {
        back_to_deal: "商談に戻る",
        create: "商談を登録",
        new: "新しい商談",
      },
      field_categories: {
        misc: "その他",
      },
      archived: {
        action: "保管する",
        error: "商談を保管できませんでした",
        list_title: "保管した商談",
        success: "商談を保管しました",
        title: "保管した商談",
        view: "保管した商談を見る",
      },
      inputs: {
        linked_to: "関連先",
      },
      unarchived: {
        action: "一覧に戻す",
        error: "商談を一覧に戻せませんでした",
        success: "商談を一覧に戻しました",
      },
      updated: "商談を更新しました",
      empty: {
        before_create: "商談を登録する前に",
        description: "まだ商談が登録されていません。",
        title: "商談がありません",
      },
      invalid_date: "日付が正しくありません",
    },
    notes: {
      name: "メモ |||| メモ",
      forcedCaseName: "メモ",
      fields: {
        status: "お客様の見込み",
        date: "日付",
        attachments: "添付ファイル",
        contact_id: "担当者",
        deal_id: "商談",
      },
      action: {
        add: "メモを書く",
        add_first: "最初のメモを書く",
        delete: "メモを削除",
        edit: "メモを直す",
        update: "メモを保存",
        add_this: "このメモを追加",
      },
      sheet: {
        create: "メモを書く",
        create_for: "%{name}さんのメモ",
        edit: "メモを直す",
        edit_for: "%{name}さんのメモ",
      },
      deleted: "メモを削除しました",
      empty: "メモはまだありません",
      author_added: "%{name}さんがメモを追加しました",
      you_added: "あなたがメモを追加しました",
      me: "自分",
      list: {
        error_loading: "メモの読み込みに失敗しました",
      },
      note_for_contact: "%{name}さんのメモ",
      stepper: {
        hint: "担当者のページを開いてメモを書いてください",
      },
      added: "メモを追加しました",
      inputs: {
        add_note: "メモを書く",
        options_hint: "（ファイルを添付する、日付などを変える）",
        show_options: "その他の項目を表示",
      },
      actions: {
        attach_document: "ファイルを添付",
      },
      validation: {
        note_or_attachment_required: "メモかファイルのどちらかを入力してください",
      },
    },
    sales: {
      name: "利用者 |||| 利用者",
      fields: {
        first_name: "名",
        last_name: "姓",
        email: "メールアドレス",
        administrator: "管理者",
        disabled: "利用停止",
      },
      create: {
        error: "利用者の登録中にエラーが起きました。",
        success:
          "利用者を登録しました。パスワード設定のメールが届きます。",
        title: "新しい利用者を登録",
      },
      edit: {
        error: "エラーが起きました。もう一度お試しください。",
        record_not_found: "データが見つかりません",
        success: "利用者情報を更新しました",
        title: "%{name}さんを修正",
      },
      action: {
        new: "新しい利用者",
      },
    },
    tasks: {
      name: "タスク |||| タスク",
      forcedCaseName: "タスク",
      fields: {
        text: "内容",
        due_date: "期限",
        type: "種類",
        contact_id: "担当者",
        due_short: "期限",
      },
      action: {
        add: "タスクを追加",
        create: "タスクを登録",
        edit: "タスクを修正",
      },
      actions: {
        postpone_next_week: "来週にずらす",
        postpone_tomorrow: "明日にずらす",
        title: "タスクの操作",
      },
      added: "タスクを追加しました",
      deleted: "タスクを削除しました",
      dialog: {
        create: "タスクを登録",
        create_for: "%{name}さんのタスク",
      },
      sheet: {
        edit: "タスクを修正",
        edit_for: "%{name}さんのタスク",
      },
      empty: "タスクはまだありません",
      empty_list_hint: "担当者に追加したタスクが、ここに表示されます。",
      filters: {
        later: "あとで",
        overdue: "期限を過ぎている",
        this_week: "今週",
        today: "今日",
        tomorrow: "明日",
        with_pending: "未完了がある",
      },
      regarding_contact: "（%{name}さんについて）",
      updated: "タスクを更新しました",
    },
    tags: {
      name: "ラベル |||| ラベル",
      action: {
        add: "ラベルを付ける",
        create: "新しいラベルを作る",
      },
      dialog: {
        color: "色",
        create_title: "新しいラベル",
        edit_title: "ラベルを修正",
        name_label: "ラベル名",
        name_placeholder: "名前を入力",
      },
    },
  },
  crm: {
    action: {
      reset_password: "パスワードを再設定",
    },
    auth: {
      first_name: "名（下の名前）",
      last_name: "姓（苗字）",
      confirm_password: "パスワード（もう一度）",
      confirmation_required:
        "登録の確認メールをお送りしました。メール内のリンクをクリックしてください。",
      recovery_email_sent:
        "登録済みの方には、まもなくパスワード再設定のメールが届きます。",
      sign_in_failed: "ログインできませんでした。",
      sign_in_google_workspace: "Googleアカウントでログイン",
      signup: {
        create_account: "利用者を登録",
        create_first_user:
          "はじめに、管理者となる方の利用者登録を行ってください。",
        creating: "登録しています…",
        initial_user_created: "最初の利用者を登録しました",
      },
      welcome_title: "お客様管理へようこそ",
    },
    common: {
      activity: "最近の動き",
      added: "追加",
      details: "詳しい内容",
      last_activity_with_date: "最後の動き %{date}",
      load_more: "もっと見る",
      misc: "その他",
      past: "過去",
      read_more: "続きを読む",
      retry: "もう一度試す",
      show_less: "閉じる",
      copied: "コピーしました",
      copy: "コピー",
      loading: "読み込み中…",
      me: "自分",
      task_count: "タスク %{smart_count}件 |||| タスク %{smart_count}件",
    },
    changelog: {
      title: "更新のお知らせ",
    },
    activity: {
      added_company: "%{name}さんが企業を登録",
      you_added_company: "あなたが企業を登録",
      added_contact: "%{name}さんが担当者を追加",
      you_added_contact: "あなたが担当者を追加",
      added_note: "%{name}さんがメモを追加（対象:",
      you_added_note: "あなたがメモを追加（対象:",
      added_note_about_deal: "%{name}さんが商談のメモを追加",
      you_added_note_about_deal: "あなたが商談のメモを追加",
      added_deal: "%{name}さんが商談を登録",
      you_added_deal: "あなたが商談を登録",
      at_company: "（",
      to: "へ",
      load_more: "もっと見る",
    },
    dashboard: {
      deals_chart: "今後の売上予定",
      deals_pipeline: "商談の進み具合",
      latest_activity: "最近の動き",
      latest_activity_error: "最近の動きを読み込めませんでした",
      latest_notes: "自分が書いたメモ",
      latest_notes_added_ago: "%{timeAgo}に追加",
      stepper: {
        install: "お客様管理の初期設定",
        progress: "%{step}/3 完了",
        whats_next: "次にすること",
      },
      upcoming_tasks: "これからのタスク",
    },
    header: {
      import_data: "データを取り込む",
    },
    image_editor: {
      change: "変更",
      drop_hint: "ファイルをここに置くか、クリックして選んでください。",
      editable_content: "編集できる部分",
      title: "画像を選んで大きさを調整",
      update_image: "画像を更新",
    },
    import: {
      action: {
        download_error_report: "エラー一覧をダウンロード",
        import: "取り込む",
        import_another: "別のファイルを取り込む",
      },
      error: {
        unable: "このファイルは取り込めません。",
      },
      idle: {
        description_1:
          "営業担当・企業・担当者・メモ・タスクをまとめて取り込めます。",
        description_2:
          "データは、見本と同じ形式のJSONファイルである必要があります。",
      },
      status: {
        all_success: "すべてのデータを取り込みました。",
        complete: "取り込みが完了しました。",
        failed: "失敗",
        imported: "取り込み済み",
        in_progress:
          "取り込み中です。この画面から移動しないでください。",
        some_failed: "一部のデータは取り込めませんでした。",
        table_caption: "取り込みの状況",
      },
      title: "データの取り込み",
    },
    settings: {
      about: "この画面について",
      companies: {
        sectors: "業種",
      },
      dark_mode_logo: "暗い画面用のロゴ",
      deals: {
        categories: "商談の種類",
        currency: "通貨",
        pipeline_help:
          "トップ画面に表示する商談の段階を選んでください。",
        pipeline_statuses: "表示する段階",
        stages: "商談の段階",
      },
      light_mode_logo: "明るい画面用のロゴ",
      notes: {
        statuses: "お客様の見込み",
      },
      reset_defaults: "最初の設定に戻す",
      save_error: "設定を保存できませんでした",
      saved: "設定を保存しました",
      saving: "保存しています…",
      tasks: {
        types: "タスクの種類",
      },
      preferences: "表示の設定",
      title: "設定",
      app_title: "画面のタイトル",
      sections: {
        branding: "名称とロゴ",
      },
      validation: {
        duplicate: "同じ名前が重複しています（%{display_name}）: %{items}",
        in_use:
          "商談で使われているため削除できません（%{display_name}）: %{items}",
        validating: "確認しています…",
        entities: {
          categories: "種類",
          stages: "段階",
        },
      },
    },
    theme: {
      dark: "暗い画面",
      label: "画面の明るさ",
      light: "明るい画面",
      system: "パソコンに合わせる",
    },
    language: "表示する言語",
    navigation: {
      label: "メニュー",
    },
    profile: {
      inbound: {
        description:
          "このシステム専用のメールアドレスにメールを送ると、内容が担当者のメモとして自動で登録されます。宛先の%{field}欄などに追加してお使いください。",
        title: "メールでメモを登録",
      },
      mcp: {
        title: "他のソフトとの連携",
        description:
          "このアドレスを使うと、AIアシスタントなど他のソフトから顧客データを参照できます。",
      },
      password: {
        change: "パスワードを変更",
      },
      password_reset_sent:
        "パスワード再設定のメールを送信しました",
      record_not_found: "データが見つかりません",
      title: "個人設定",
      updated: "個人設定を更新しました",
      update_error: "エラーが起きました。もう一度お試しください",
    },
    validation: {
      invalid_url: "正しいアドレス（URL）を入力してください",
      invalid_linkedin_url: "LinkedInのページのアドレスを入力してください",
    },
  },
};
