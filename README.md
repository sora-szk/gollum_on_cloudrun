# gollum_on_cloudrun

cloudRun上でgollumをホスティングするプロジェクトです。  
毎分行われるバッチ処理によってリモートリポジトリと同期を取り、最新の状態を維持します。  
また、デフォルトではprdおよびdevの2環境に対応しています。  
インフラ設定は`/gcp/config/`、アプリケーション設定は`/docker/app/config.rb`から変更できます。  

## setup

1. /.template.env をコピーしたファイル、/.envを作成します。  
2. google cloudコンソールから、新規プロジェクトを作成します。
3. 新規プロジェクトのIDを/.envの`PROJECT_ID_PRD`もしくは`PROJECT_ID_DEV`に記載します。
4. https://console.cloud.google.com/iam-admin/serviceaccounts から、以下の権限を持ったサービスアカウントを作成します
   1. Cloud Run 管理者
   2. Container Registry サービス エージェント
   3. サービス アカウント ユーザー
   4. ストレージ管理者
5. 3のサービスアカウントの認証鍵を`/serviceAccounts`に配置します
6. 1. state管理
   1. gcpプロジェクト > cloud storage
   2. バケットを作成
      1. ${projectID}-cdktf という名前のバケットを作成します。
7. APIの有効化
   1. Cloud Run API
   2. Cloud Storage API
   3. Container Registry API