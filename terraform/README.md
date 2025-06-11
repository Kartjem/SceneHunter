# SceneHunter V2 - Terraform Infrastructure

Terraform конфигурация для настройки Google Cloud Platform инфраструктуры проекта SceneHunter V2.

## 🏗️ Архитектура

### Компоненты инфраструктуры:
- **VPC Network** с приватными и публичными подсетями
- **Cloud NAT** для исходящего интернет-трафика
- **Firewall Rules** с принципом минимальных привилегий
- **IAM Roles & Service Accounts** с ограниченными правами
- **Cloud Storage** для различных целей (static assets, backups, logs)
- **Secret Manager** для безопасного хранения ключей

### Включенные API:
- Firebase & Firestore
- Google Maps & Places
- Vertex AI & ML
- Cloud Storage
- Cloud Run
- Cloud SQL
- Pub/Sub
- Monitoring & Logging

## 🚀 Быстрый старт

### 1. Предварительные требования

```bash
brew install terraform

brew install google-cloud-sdk

gcloud auth login
gcloud auth application-default login

gcloud config set project scenehunter-29ff8
```

### 2. Настройка переменных

```bash
cp terraform.tfvars.example terraform.tfvars

nano terraform.tfvars
```

### 3. Инициализация и развертывание

```bash
terraform init

terraform plan

terraform apply
```

## 📁 Структура файлов

```
terraform/
├── main.tf              # Основная конфигурация и провайдеры
├── variables.tf         # Определение переменных
├── outputs.tf          # Выходные значения
├── apis.tf             # Включение Google Cloud API
├── network.tf          # VPC, подсети, NAT Gateway
├── firewall.tf         # Правила файрвола
├── iam.tf              # IAM роли и service accounts
├── storage.tf          # Cloud Storage buckets
├── terraform.tfvars.example  # Пример файла переменных
└── README.md           # Документация
```

## 🔐 Безопасность

### Принципы безопасности:
- **Принцип минимальных привилегий** для всех IAM ролей
- **Приватные подсети** для backend сервисов
- **NAT Gateway** для исходящего трафика из приватных сетей
- **Firewall rules** с ограниченным доступом
- **Secret Manager** для хранения ключей API
- **Uniform bucket-level access** для Cloud Storage
- **Public access prevention** для критических buckets

### Service Accounts:
- `scenehunter-dev-backend-api` - для backend API
- `scenehunter-dev-frontend-app` - для frontend приложения
- `scenehunter-dev-terraform` - для управления инфраструктурой

## 🌐 Сетевая архитектура

### VPC: `scenehunter-dev-vpc` (10.0.0.0/16)
- **Public Subnet**: 10.0.1.0/24 (Load Balancers, NAT Gateway)
- **Private Subnet**: 10.0.2.0/24 (Backend Services, Compute)
- **Database Subnet**: 10.0.3.0/24 (Cloud SQL Private IP)

### Правила файрвола:
- HTTP/HTTPS (80, 443) - публичный доступ к web-серверам
- SSH (22) - ограниченный доступ для администрирования
- Backend API (3001, 8080) - внутренний доступ
- Internal traffic - полный доступ внутри VPC
- Health checks - доступ для Google Cloud Load Balancer

## 💾 Storage Buckets

1. **Terraform State**: `scenehunter-29ff8-terraform-state`
   - Версионирование включено
   - Предотвращение удаления
   
2. **App Storage**: `scenehunter-29ff8-app-storage`
   - Пользовательские загрузки
   - CORS настроен для web app
   
3. **Static Assets**: `scenehunter-29ff8-static-assets`
   - Публичный доступ для CDN
   - Website конфигурация
   
4. **Backups**: `scenehunter-29ff8-backups`
   - Автоматическое удаление через 90 дней
   - Переход в Coldline storage через 7 дней
   
5. **Logs**: `scenehunter-29ff8-logs`
   - Хранение логов приложения
   - Автоматическое удаление через 30 дней

## 🔧 Настройка backend

После развертывания инфраструктуры:

1. Получение service account key:
```bash
terraform output -raw backend_api_service_account_key | base64 -d > ../backend/serviceAccountKey.json
```

2. Обновление `.env` файла backend:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

## 📊 Мониторинг и логирование

- **Cloud Monitoring** - метрики приложения
- **Cloud Logging** - централизованное логирование
- **Flow logs** - сетевой трафик
- **Firewall logs** - события файрвола

## 🔄 Управление состоянием

После первого применения настройте remote state:

1. Раскомментируйте backend конфигурацию в `main.tf`
2. Выполните `terraform init` для миграции state в Cloud Storage

## 🧪 Тестирование

Проверка корректности развертывания:

```bash
gcloud services list --enabled --project=scenehunter-29ff8

gcloud compute networks describe scenehunter-dev-vpc --project=scenehunter-29ff8

gcloud iam service-accounts list --project=scenehunter-29ff8

gsutil ls -p scenehunter-29ff8
```

## 🗑️ Очистка ресурсов

```bash
terraform destroy

terraform destroy -target=google_storage_bucket.example
```

## 📝 Переменные окружения

Основные переменные в `terraform.tfvars`:

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `project_id` | ID проекта GCP | `scenehunter-29ff8` |
| `environment` | Окружение | `dev` |
| `region` | Регион GCP | `europe-west1` |
| `vpc_cidr` | CIDR блок VPC | `10.0.0.0/16` |

## 🆘 Устранение неполадок

### Общие проблемы:

1. **Ошибки аутентификации**:
   ```bash
   gcloud auth application-default login
   ```

2. **API не включены**:
   ```bash
   gcloud services enable compute.googleapis.com
   ```

3. **Недостаточно прав**:
   - Проверьте IAM роли текущего пользователя
   - Убедитесь в наличии роли Project Editor или Owner

4. **Конфликты ресурсов**:
   - Проверьте уникальность имен buckets
   - Убедитесь, что проект не содержит конфликтующих ресурсов
